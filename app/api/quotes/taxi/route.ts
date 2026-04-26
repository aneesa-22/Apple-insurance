import { NextRequest, NextResponse } from "next/server";
// CHANGED: using Nodemailer instead of Resend
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

// CHANGED: SMTP transporter replaces Resend
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 25_000;

// Note: this is an in-memory rate limiter.
// It is fine as a basic layer, but for production across multiple instances
// you should eventually move this to a shared store like Redis / Upstash.
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const allowedTitles = ["Mr", "Mrs", "Miss", "Ms", "Mx"];
const allowedMaritalStatuses = [
  "Single",
  "Married",
  "Civil Partnership",
  "Separated",
  "Divorced",
  "Widowed",
];
const allowedYesNo = ["Yes", "No"];
const allowedNoClaimsBonus = ["0", "1", "2", "3", "4", "5+"];

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type TaxiQuotePayload = {
  website?: string;
  turnstileToken?: string;

  title?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  addressLine1?: string;
  postcode?: string;

  drivingLicenceType?: string;
  licenceNumber?: string;
  licenceAuthority?: string;
  vehicleRegistration?: string;
  noClaimsBonus?: string;
  hadClaims?: string;
  claimCount?: string;
  renewalDate?: string;
  policyCancelledDeclinedVoided?: string;
  criminalConvictionsOrCcjs?: string;
  additionalNotes?: string;
};

type FieldErrors = Partial<Record<keyof TaxiQuotePayload, string>>;

/* -------------------------------------------------------------------------- */
/* Response helper                                                            */
/* -------------------------------------------------------------------------- */

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Request metadata helpers                                                   */
/* -------------------------------------------------------------------------- */

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = rateLimitStore.get(ip);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  current.count += 1;
  rateLimitStore.set(ip, current);

  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

/* -------------------------------------------------------------------------- */
/* Sanitising                                                                 */
/* -------------------------------------------------------------------------- */

function sanitise(value: unknown, maxLength = 250) {
  if (typeof value !== "string") return "";

  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

/* -------------------------------------------------------------------------- */
/* Validation helpers                                                         */
/* -------------------------------------------------------------------------- */

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function isValidUkPhone(value: string) {
  const cleaned = value.replace(/[\s()-]/g, "");
  return /^(?:\+44|0044|0)\d{9,10}$/.test(cleaned);
}

function isValidPostcode(value: string) {
  return /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(value);
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime());
}

function isPastDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  const today = new Date();

  today.setHours(23, 59, 59, 999);

  return date <= today;
}

function getAge(value: string) {
  const today = new Date();
  const dob = new Date(`${value}T00:00:00.000Z`);

  let age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < dob.getDate())
  ) {
    age -= 1;
  }

  return age;
}

function isAtLeast21(value: string) {
  return isValidDate(value) && getAge(value) >= 21;
}

function isValidName(value: string) {
  return /^[A-Za-zÀ-ÿ' -]+$/.test(value);
}

/* -------------------------------------------------------------------------- */
/* Turnstile                                                                  */
/* -------------------------------------------------------------------------- */

async function verifyTurnstile(token: string, remoteip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return {
      success: false,
      "error-codes": ["missing-input-secret"],
    };
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip,
      }),
      cache: "no-store",
    }
  );

  return response.json();
}

/* -------------------------------------------------------------------------- */
/* Payload validation                                                         */
/* -------------------------------------------------------------------------- */

function validatePayload(data: TaxiQuotePayload) {
  const errors: FieldErrors = {};

  if (!allowedTitles.includes(data.title || "")) {
    errors.title = "Please select your title.";
  }

  if (!data.firstName) {
    errors.firstName = "Please enter your first name.";
  } else if (data.firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters.";
  } else if (!isValidName(data.firstName)) {
    errors.firstName = "First name can only contain letters.";
  }

  if (!data.lastName) {
    errors.lastName = "Please enter your last name.";
  } else if (data.lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters.";
  } else if (!isValidName(data.lastName)) {
    errors.lastName = "Last name can only contain letters.";
  }

  if (!data.phone) {
    errors.phone = "Please enter your phone number.";
  } else if (!isValidUkPhone(data.phone)) {
    errors.phone = "Please enter a valid UK phone number.";
  }

  if (!data.email) {
    errors.email = "Please enter your email address.";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = "Please enter your date of birth.";
  } else if (!isValidDate(data.dateOfBirth) || !isPastDate(data.dateOfBirth)) {
    errors.dateOfBirth = "Please enter a valid date of birth.";
  } else if (!isAtLeast21(data.dateOfBirth)) {
    errors.dateOfBirth = "We’re unable to offer cover for drivers under 21.";
  }

  if (!allowedMaritalStatuses.includes(data.maritalStatus || "")) {
    errors.maritalStatus = "Please select your marital status.";
  }

  if (!data.addressLine1) {
    errors.addressLine1 = "Please enter the first line of your address.";
  }

  if (!data.postcode) {
    errors.postcode = "Please enter your postcode.";
  } else if (!isValidPostcode(data.postcode)) {
    errors.postcode = "Please enter a valid UK postcode.";
  }

  if (!data.licenceNumber) {
    errors.licenceNumber = "Please enter your driving licence number.";
  } else if (data.licenceNumber.length < 8) {
    errors.licenceNumber = "Please enter a valid driving licence number.";
  }

  if (!data.licenceAuthority) {
    errors.licenceAuthority = "Please enter your licensing authority.";
  }

  if (!data.vehicleRegistration) {
    errors.vehicleRegistration = "Please enter your vehicle registration.";
  } else if (!/^[A-Z0-9 ]{2,10}$/i.test(data.vehicleRegistration)) {
    errors.vehicleRegistration = "Please enter a valid vehicle registration.";
  }

  if (!allowedNoClaimsBonus.includes(data.noClaimsBonus || "")) {
    errors.noClaimsBonus = "Please select your no claims bonus.";
  }

  if (!allowedYesNo.includes(data.hadClaims || "")) {
    errors.hadClaims = "Please tell us if you have had any claims.";
  }

  if (data.hadClaims === "Yes") {
    const claimCount = Number(data.claimCount);

    if (!data.claimCount) {
      errors.claimCount = "Please enter how many claims you have had.";
    } else if (
      !Number.isInteger(claimCount) ||
      claimCount < 1 ||
      claimCount > 20
    ) {
      errors.claimCount = "Please enter a valid number of claims.";
    }
  }

  if (!data.renewalDate) {
    errors.renewalDate = "Please enter your current policy renewal date.";
  } else if (!isValidDate(data.renewalDate)) {
    errors.renewalDate = "Please enter a valid renewal date.";
  }

  if (!allowedYesNo.includes(data.policyCancelledDeclinedVoided || "")) {
    errors.policyCancelledDeclinedVoided =
      "Please tell us if a policy has ever been cancelled, declined, or voided.";
  }

  if (!allowedYesNo.includes(data.criminalConvictionsOrCcjs || "")) {
    errors.criminalConvictionsOrCcjs =
      "Please tell us if you have any criminal convictions, bankruptcy, or CCJs.";
  }

  if (data.additionalNotes && data.additionalNotes.length > 1000) {
    errors.additionalNotes =
      "Additional details must be under 1000 characters.";
  }

  return errors;
}

/* -------------------------------------------------------------------------- */
/* Email formatting                                                           */
/* -------------------------------------------------------------------------- */

function escapeHtml(value: string | undefined | null) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function valueOrFallback(value: string | undefined | null) {
  return value && String(value).trim() !== "" ? String(value) : "N/A";
}

function row(label: string, value: string | undefined | null) {
  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(
    valueOrFallback(value)
  )}</p>`;
}

function formatInternalEmailHtml(data: TaxiQuotePayload) {
  return `
    <div style="font-family: Arial, sans-serif; color: #18181b;">
      <h2>New Taxi Insurance Enquiry</h2>

      <h3>Your details</h3>
      ${row("Title", data.title)}
      ${row("First name", data.firstName)}
      ${row("Last name", data.lastName)}
      ${row("Phone", data.phone)}
      ${row("Email", data.email)}
      ${row("Date of birth", data.dateOfBirth)}
      ${row("Marital status", data.maritalStatus)}
      ${row("First line of address", data.addressLine1)}
      ${row("Postcode", data.postcode)}

      <hr style="margin: 24px 0;" />

      <h3>Quote details</h3>
      ${row("Driving licence number", data.licenceNumber)}
      ${row("Licensing authority", data.licenceAuthority)}
      ${row("Vehicle registration", data.vehicleRegistration)}
      ${row("No claims bonus", data.noClaimsBonus)}
      ${row("Had claims", data.hadClaims)}
      ${row("Claim count", data.claimCount)}
      ${row("Renewal date", data.renewalDate)}
      ${row(
        "Policy cancelled / declined / voided",
        data.policyCancelledDeclinedVoided
      )}
      ${row(
        "Criminal convictions / bankruptcy / CCJs",
        data.criminalConvictionsOrCcjs
      )}
      ${row("Additional notes", data.additionalNotes)}
    </div>
  `;
}

function formatCustomerEmailHtml(firstName: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #18181b;">
      <h2>We’ve received your taxi insurance enquiry</h2>
      <p>Hi ${escapeHtml(firstName || "there")},</p>
      <p>Thank you for contacting Apple Insurance Services.</p>
      <p>Your enquiry has been received and a member of our team will be in touch soon.</p>
      <p>If you need to speak to us in the meantime, please call <strong>0161 881 2139</strong>.</p>
    </div>
  `;
}

/* -------------------------------------------------------------------------- */
/* Route                                                                      */
/* -------------------------------------------------------------------------- */

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return jsonResponse(
      {
        error: "Too many attempts. Please wait a few minutes and try again.",
      },
      429
    );
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return jsonResponse(
      {
        error: "Invalid request type.",
      },
      415
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse(
      {
        error:
          "Your enquiry is too large. Please shorten your message and try again.",
      },
      413
    );
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return jsonResponse(
          {
            error: "This request could not be verified.",
          },
          403
        );
      }
    } catch {
      return jsonResponse(
        {
          error: "This request could not be verified.",
        },
        403
      );
    }
  }

  let rawData: TaxiQuotePayload;

  try {
    rawData = await request.json();
  } catch {
    return jsonResponse(
      {
        error: "Invalid form data. Please refresh the page and try again.",
      },
      400
    );
  }

  if (rawData.website) {
    return jsonResponse({ success: true }, 200);
  }

  const turnstileToken = sanitise(rawData.turnstileToken, 2048);

  if (!turnstileToken) {
    return jsonResponse(
      {
        error: "Please complete the captcha verification.",
      },
      400
    );
  }

  let turnstileResult: any;

  try {
    turnstileResult = await verifyTurnstile(turnstileToken, ip);
  } catch {
    return jsonResponse(
      {
        error: "Captcha verification failed. Please try again.",
      },
      400
    );
  }

  const expectedHostname =
    process.env.NEXT_PUBLIC_SITE_URL &&
    (() => {
      try {
        return new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname;
      } catch {
        return null;
      }
    })();

  if (
    !turnstileResult?.success ||
    (expectedHostname &&
      turnstileResult.hostname &&
      turnstileResult.hostname !== expectedHostname)
  ) {
    return jsonResponse(
      {
        error: "Captcha verification failed. Please try again.",
      },
      400
    );
  }

  const data: TaxiQuotePayload = {
    title: sanitise(rawData.title, 10),
    firstName: sanitise(rawData.firstName, 80),
    lastName: sanitise(rawData.lastName, 80),
    phone: sanitise(rawData.phone, 30),
    email: sanitise(rawData.email, 120).toLowerCase(),
    dateOfBirth: sanitise(rawData.dateOfBirth, 20),
    maritalStatus: sanitise(rawData.maritalStatus, 40),
    addressLine1: sanitise(rawData.addressLine1, 120),
    postcode: sanitise(rawData.postcode, 12).toUpperCase(),
    drivingLicenceType: sanitise(rawData.drivingLicenceType, 40),
    licenceNumber: sanitise(rawData.licenceNumber, 40).toUpperCase(),
    licenceAuthority: sanitise(rawData.licenceAuthority, 120),
    vehicleRegistration: sanitise(rawData.vehicleRegistration, 20).toUpperCase(),
    noClaimsBonus: sanitise(rawData.noClaimsBonus, 10),
    hadClaims: sanitise(rawData.hadClaims, 10),
    claimCount: sanitise(rawData.claimCount, 10),
    renewalDate: sanitise(rawData.renewalDate, 20),
    policyCancelledDeclinedVoided: sanitise(
      rawData.policyCancelledDeclinedVoided,
      10
    ),
    criminalConvictionsOrCcjs: sanitise(rawData.criminalConvictionsOrCcjs, 10),
    additionalNotes: sanitise(rawData.additionalNotes, 1000),
  };

  const errors = validatePayload(data);

  if (Object.keys(errors).length > 0) {
    return jsonResponse(
      {
        error: "Please complete the highlighted fields.",
        errors,
      },
      400
    );
  }

  const notificationEmail = process.env.QUOTE_NOTIFICATION_EMAIL;
  const fromEmail = process.env.QUOTE_FROM_EMAIL;

  // CHANGED: SMTP config check replaces RESEND_API_KEY check
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !notificationEmail ||
    !fromEmail
  ) {
    console.error("Missing taxi email configuration", {
      hasSmtpHost: Boolean(process.env.SMTP_HOST),
      hasSmtpPort: Boolean(process.env.SMTP_PORT),
      hasSmtpUser: Boolean(process.env.SMTP_USER),
      hasSmtpPass: Boolean(process.env.SMTP_PASS),
      hasNotificationEmail: Boolean(notificationEmail),
      hasFromEmail: Boolean(fromEmail),
    });

    return jsonResponse(
      {
        error: "Email service is not configured properly.",
      },
      500
    );
  }

  // CHANGED: send internal email with SMTP instead of Resend
  try {
    await transporter.sendMail({
      from: fromEmail,
      to: notificationEmail,
      subject: `New Taxi Insurance Enquiry - ${data.firstName} ${data.lastName}`,
      html: formatInternalEmailHtml(data),
      replyTo: data.email,
    });
  } catch (error) {
    console.error("Taxi internal email failed", error);

    return jsonResponse(
      {
        error: "Your enquiry could not be sent. Please try again or call us.",
      },
      500
    );
  }

  // CHANGED: send customer acknowledgement with SMTP instead of Resend
  try {
    await transporter.sendMail({
      from: fromEmail,
      to: data.email || "",
      subject: "We’ve received your taxi insurance enquiry",
      html: formatCustomerEmailHtml(data.firstName || ""),
    });
  } catch (error) {
    console.error("Taxi customer email failed", error);

    return jsonResponse(
      {
        error: "Your acknowledgement email could not be sent.",
      },
      500
    );
  }

  console.log("Taxi quote enquiry received", {
    receivedAt: new Date().toISOString(),
    ip,
    hadClaims: data.hadClaims,
    noClaimsBonus: data.noClaimsBonus,
    hasLicenceNumber: Boolean(data.licenceNumber),
  });

  return jsonResponse({
    success: true,
    message: "Your enquiry has been sent successfully.",
  });
}

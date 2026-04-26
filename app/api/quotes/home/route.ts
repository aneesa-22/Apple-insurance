import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

const resend = new Resend(process.env.RESEND_API_KEY);

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
const allowedPropertyTypes = [
  "Flat",
  "Semi-detached",
  "Detached",
  "Terraced",
  "Bungalow",
];

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type HomeQuotePayload = {
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

  propertyType?: string;
  bedroomCount?: string;
  livingRoomCount?: string;
  toiletCount?: string;
  yearBuilt?: string;
  flatRoof?: string;
  sumInsured?: string;
  hadClaims?: string;
  claimCount?: string;
  policyCancelledDeclinedVoided?: string;
  criminalConvictionsOrCcjs?: string;
  additionalNotes?: string;
};

type FieldErrors = Partial<Record<keyof HomeQuotePayload, string>>;

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

function isPositiveWholeNumber(value: string) {
  return /^\d+$/.test(value) && Number(value) >= 0;
}

function isValidMoneyLike(value: string) {
  return /^[\d\s,£.]+$/.test(value) && /\d/.test(value);
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

function validatePayload(data: HomeQuotePayload) {
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
    errors.dateOfBirth =
      "We’re currently unable to offer cover for people under 21.";
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

  if (!allowedPropertyTypes.includes(data.propertyType || "")) {
    errors.propertyType = "Please select your property type.";
  }

  if (!data.bedroomCount) {
    errors.bedroomCount = "Please enter the number of bedrooms.";
  } else if (!isPositiveWholeNumber(data.bedroomCount)) {
    errors.bedroomCount = "Please enter a valid number of bedrooms.";
  }

  if (!data.livingRoomCount) {
    errors.livingRoomCount = "Please enter the number of living rooms.";
  } else if (!isPositiveWholeNumber(data.livingRoomCount)) {
    errors.livingRoomCount = "Please enter a valid number of living rooms.";
  }

  if (!data.toiletCount) {
    errors.toiletCount = "Please enter the number of bathrooms / WCs.";
  } else if (!isPositiveWholeNumber(data.toiletCount)) {
    errors.toiletCount = "Please enter a valid number of bathrooms / WCs.";
  }

  if (!data.yearBuilt) {
    errors.yearBuilt = "Please enter the year built.";
  } else if (!/^\d{4}$/.test(data.yearBuilt)) {
    errors.yearBuilt = "Please enter a valid 4-digit year.";
  }

  if (!allowedYesNo.includes(data.flatRoof || "")) {
    errors.flatRoof = "Please tell us if there is any flat roof.";
  }

  if (!data.sumInsured) {
    errors.sumInsured = "Please enter the cover amount.";
  } else if (!isValidMoneyLike(data.sumInsured)) {
    errors.sumInsured = "Please enter a valid cover amount.";
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

function row(label: string, value: string | undefined | null) {
  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(
    value || "N/A"
  )}</p>`;
}

function formatInternalEmailHtml(data: HomeQuotePayload) {
  return `
    <div style="font-family: Arial, sans-serif; color: #18181b;">
      <h2>New Home Insurance Enquiry</h2>

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
      ${row("Property type", data.propertyType)}
      ${row("Bedrooms", data.bedroomCount)}
      ${row("Living rooms", data.livingRoomCount)}
      ${row("Bathrooms / WCs", data.toiletCount)}
      ${row("Year built", data.yearBuilt)}
      ${row("Any flat roof", data.flatRoof)}
      ${row("Cover amount", data.sumInsured)}
      ${row("Had claims", data.hadClaims)}
      ${row("Claim count", data.claimCount)}
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
      <h2>We’ve received your home insurance enquiry</h2>
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

  let rawData: HomeQuotePayload;

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

  const data: HomeQuotePayload = {
    title: sanitise(rawData.title, 10),
    firstName: sanitise(rawData.firstName, 80),
    lastName: sanitise(rawData.lastName, 80),
    phone: sanitise(rawData.phone, 30),
    email: sanitise(rawData.email, 120).toLowerCase(),
    dateOfBirth: sanitise(rawData.dateOfBirth, 20),
    maritalStatus: sanitise(rawData.maritalStatus, 40),
    addressLine1: sanitise(rawData.addressLine1, 120),
    postcode: sanitise(rawData.postcode, 12).toUpperCase(),
    propertyType: sanitise(rawData.propertyType, 40),
    bedroomCount: sanitise(rawData.bedroomCount, 10),
    livingRoomCount: sanitise(rawData.livingRoomCount, 10),
    toiletCount: sanitise(rawData.toiletCount, 10),
    yearBuilt: sanitise(rawData.yearBuilt, 10),
    flatRoof: sanitise(rawData.flatRoof, 10),
    sumInsured: sanitise(rawData.sumInsured, 40),
    hadClaims: sanitise(rawData.hadClaims, 10),
    claimCount: sanitise(rawData.claimCount, 10),
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

  if (!process.env.RESEND_API_KEY || !notificationEmail || !fromEmail) {
    console.error("Missing home email configuration", {
      hasResendKey: Boolean(process.env.RESEND_API_KEY),
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

  const internalEmailResult = await resend.emails.send({
    from: fromEmail,
    to: notificationEmail,
    subject: `New Home Insurance Enquiry - ${data.firstName} ${data.lastName}`,
    html: formatInternalEmailHtml(data),
    replyTo: data.email,
  });

  if (internalEmailResult.error) {
    console.error("Home internal email failed", internalEmailResult.error);

    return jsonResponse(
      {
        error: "Your enquiry could not be sent. Please try again or call us.",
      },
      500
    );
  }

  const customerEmailResult = await resend.emails.send({
    from: fromEmail,
    to: data.email || "",
    subject: "We’ve received your home insurance enquiry",
    html: formatCustomerEmailHtml(data.firstName || ""),
  });

  if (customerEmailResult.error) {
    console.error("Home customer email failed", customerEmailResult.error);

    return jsonResponse(
      {
        error: "Your acknowledgement email could not be sent.",
      },
      500
    );
  }

  console.log("Home quote enquiry received", {
    receivedAt: new Date().toISOString(),
    ip,
    propertyType: data.propertyType,
    hadClaims: data.hadClaims,
    hasSumInsured: Boolean(data.sumInsured),
  });

  return jsonResponse({
    success: true,
    message: "Your enquiry has been sent successfully.",
  });
}

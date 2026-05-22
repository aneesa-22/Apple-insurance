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
const allowedYesNoNa = ["Yes", "No", "N/A"];
const allowedPropertyTypes = ["House", "Flat", "Maisonette"];
const allowedTenantTypes = [
  "Working tenants",
  "Family tenants",
  "Students",
  "DSS / Universal Credit",
  "Company let",
];
const allowedLiabilityOptions = ["£2m", "£5m", "£10m"];

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type LandlordQuotePayload = {
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

  hadClaimsLastFiveYears?: string;
  claimCount?: string;
  propertyAddress?: string;
  propertyType?: string;
  bedroomCount?: string;
  yearBuilt?: string;
  standardConstruction?: string;
  floodingHistory?: string;
  subsidenceHistory?: string;
  structuralMovementHistory?: string;
  tenantType?: string;
  tenantCount?: string;
  writtenTenancyAgreement?: string;
  longTermLet?: string;
  isHmo?: string;
  businessUse?: string;
  emptyMoreThanThirtyDays?: string;

  buildingsCover?: string;
  contentsCover?: string;
  lossOfRentCover?: string;
  propertyOwnersLiability?: string;
  accidentalDamage?: string;
  hasMortgage?: string;
  lenderName?: string;
  buyToLetMortgage?: string;
  smokeAlarms?: string;
  gasSafetyCertificate?: string;
  electricalSafetyCertificate?: string;
  previousInsurerName?: string;
  renewalDate?: string;
  additionalNotes?: string;
};

type FieldErrors = Partial<Record<keyof LandlordQuotePayload, string>>;

type TurnstileVerificationResult = {
  success?: boolean;
  hostname?: string;
  "error-codes"?: string[];
};

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

function isFutureOrToday(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return !Number.isNaN(date.getTime()) && date >= today;
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

/* -------------------------------------------------------------------------- */
/* Turnstile                                                                  */
/* -------------------------------------------------------------------------- */

async function verifyTurnstile(
  token: string,
  remoteip?: string
): Promise<TurnstileVerificationResult> {
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

  return response.json() as Promise<TurnstileVerificationResult>;
}

/* -------------------------------------------------------------------------- */
/* Payload validation                                                         */
/* -------------------------------------------------------------------------- */

function validatePayload(data: LandlordQuotePayload) {
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

  if (!allowedYesNo.includes(data.hadClaimsLastFiveYears || "")) {
    errors.hadClaimsLastFiveYears =
      "Please tell us if there have been any property claims in the last 5 years.";
  }

  if (data.hadClaimsLastFiveYears === "Yes") {
    const claimCount = Number(data.claimCount);

    if (!data.claimCount) {
      errors.claimCount = "Please enter how many claims there have been.";
    } else if (
      !Number.isInteger(claimCount) ||
      claimCount < 1 ||
      claimCount > 20
    ) {
      errors.claimCount = "Please enter a valid number of claims.";
    }
  }

  if (!data.propertyAddress) {
    errors.propertyAddress = "Please enter the property address.";
  }

  if (!allowedPropertyTypes.includes(data.propertyType || "")) {
    errors.propertyType = "Please select the property type.";
  }

  if (!data.bedroomCount) {
    errors.bedroomCount = "Please enter the number of bedrooms.";
  } else if (!isPositiveWholeNumber(data.bedroomCount)) {
    errors.bedroomCount = "Please enter a valid number of bedrooms.";
  }

  if (!data.yearBuilt) {
    errors.yearBuilt = "Please enter the year built.";
  } else if (!/^\d{4}$/.test(data.yearBuilt)) {
    errors.yearBuilt = "Please enter a valid 4-digit year.";
  }

  if (!allowedYesNo.includes(data.standardConstruction || "")) {
    errors.standardConstruction =
      "Please tell us if the property is standard construction.";
  }

  if (!allowedYesNo.includes(data.floodingHistory || "")) {
    errors.floodingHistory =
      "Please tell us if the property has ever flooded.";
  }

  if (!allowedYesNo.includes(data.subsidenceHistory || "")) {
    errors.subsidenceHistory =
      "Please tell us if the property has had subsidence.";
  }

  if (!allowedYesNo.includes(data.structuralMovementHistory || "")) {
    errors.structuralMovementHistory =
      "Please tell us if there has been structural movement or issues.";
  }

  if (!allowedTenantTypes.includes(data.tenantType || "")) {
    errors.tenantType = "Please select who lives in the property.";
  }

  if (!data.tenantCount) {
    errors.tenantCount = "Please enter the number of tenants.";
  } else if (!isPositiveWholeNumber(data.tenantCount)) {
    errors.tenantCount = "Please enter a valid number of tenants.";
  }

  if (!allowedYesNo.includes(data.writtenTenancyAgreement || "")) {
    errors.writtenTenancyAgreement =
      "Please tell us if you have a tenancy agreement.";
  }

  if (!allowedYesNo.includes(data.longTermLet || "")) {
    errors.longTermLet = "Please tell us if this is a long-term let.";
  }

  if (!allowedYesNo.includes(data.isHmo || "")) {
    errors.isHmo = "Please tell us if the property is an HMO.";
  }

  if (!allowedYesNo.includes(data.businessUse || "")) {
    errors.businessUse =
      "Please tell us if the property is used for business purposes.";
  }

  if (!allowedYesNo.includes(data.emptyMoreThanThirtyDays || "")) {
    errors.emptyMoreThanThirtyDays =
      "Please tell us if the property will be empty for more than 30 days.";
  }

  if (!allowedYesNo.includes(data.buildingsCover || "")) {
    errors.buildingsCover = "Please tell us if you need buildings cover.";
  }

  if (!allowedYesNo.includes(data.contentsCover || "")) {
    errors.contentsCover = "Please tell us if you need contents cover.";
  }

  if (!allowedYesNo.includes(data.lossOfRentCover || "")) {
    errors.lossOfRentCover = "Please tell us if you need loss of rent cover.";
  }

  if (!allowedLiabilityOptions.includes(data.propertyOwnersLiability || "")) {
    errors.propertyOwnersLiability =
      "Please select the property owners' liability level.";
  }

  if (!allowedYesNo.includes(data.accidentalDamage || "")) {
    errors.accidentalDamage =
      "Please tell us if you need accidental damage cover.";
  }

  if (!allowedYesNo.includes(data.hasMortgage || "")) {
    errors.hasMortgage =
      "Please tell us if there is a mortgage on the property.";
  }

  if (data.hasMortgage === "Yes" && !data.lenderName) {
    errors.lenderName = "Please enter the lender name.";
  }

  if (
    data.hasMortgage === "Yes" &&
    !allowedYesNo.includes(data.buyToLetMortgage || "")
  ) {
    errors.buyToLetMortgage =
      "Please tell us if it is a buy-to-let mortgage.";
  }

  if (!allowedYesNo.includes(data.smokeAlarms || "")) {
    errors.smokeAlarms = "Please tell us if smoke alarms are installed.";
  }

  if (!allowedYesNoNa.includes(data.gasSafetyCertificate || "")) {
    errors.gasSafetyCertificate =
      "Please tell us about the gas safety certificate.";
  }

  if (!allowedYesNo.includes(data.electricalSafetyCertificate || "")) {
    errors.electricalSafetyCertificate =
      "Please tell us about the electrical safety certificate.";
  }

  if (!data.previousInsurerName) {
    errors.previousInsurerName = "Please enter the previous insurer name.";
  }

  if (!data.renewalDate) {
    errors.renewalDate = "Please enter the renewal date.";
  } else if (
    !isValidDate(data.renewalDate) ||
    !isFutureOrToday(data.renewalDate)
  ) {
    errors.renewalDate = "Please enter a valid renewal date.";
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

function formatInternalEmailHtml(data: LandlordQuotePayload) {
  return `
    <div style="font-family: Arial, sans-serif; color: #18181b;">
      <h2>New Landlord Insurance Enquiry</h2>

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

      <h3>Property details</h3>
      ${row(
        "Any property claims in the last 5 years",
        data.hadClaimsLastFiveYears
      )}
      ${row("How many claims", data.claimCount)}
      ${row("Property address", data.propertyAddress)}
      ${row("Property type", data.propertyType)}
      ${row("Bedrooms", data.bedroomCount)}
      ${row("Year built", data.yearBuilt)}
      ${row("Standard construction", data.standardConstruction)}
      ${row("Flooding history", data.floodingHistory)}
      ${row("Subsidence history", data.subsidenceHistory)}
      ${row("Structural movement history", data.structuralMovementHistory)}
      ${row("Tenant type", data.tenantType)}
      ${row("Number of tenants", data.tenantCount)}
      ${row("Written tenancy agreement", data.writtenTenancyAgreement)}
      ${row("Long-term let", data.longTermLet)}
      ${row("HMO", data.isHmo)}
      ${row("Business use", data.businessUse)}
      ${row("Empty more than 30 days", data.emptyMoreThanThirtyDays)}

      <hr style="margin: 24px 0;" />

      <h3>Cover and insurance</h3>
      ${row("Buildings cover", data.buildingsCover)}
      ${row("Contents cover", data.contentsCover)}
      ${row("Loss of rent cover", data.lossOfRentCover)}
      ${row("Property owners liability", data.propertyOwnersLiability)}
      ${row("Accidental damage", data.accidentalDamage)}
      ${row("Has mortgage", data.hasMortgage)}
      ${row("Lender name", data.lenderName)}
      ${row("Buy-to-let mortgage", data.buyToLetMortgage)}
      ${row("Smoke alarms", data.smokeAlarms)}
      ${row("Gas safety certificate", data.gasSafetyCertificate)}
      ${row(
        "Electrical safety certificate",
        data.electricalSafetyCertificate
      )}
      ${row("Previous insurer", data.previousInsurerName)}
      ${row("Renewal date", data.renewalDate)}
      ${row("Additional notes", data.additionalNotes)}
    </div>
  `;
}

function formatCustomerEmailHtml(firstName: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #18181b;">
      <h2>We've received your landlord insurance enquiry</h2>
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

  let rawData: LandlordQuotePayload;

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

  let turnstileResult: TurnstileVerificationResult;

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

  const data: LandlordQuotePayload = {
    title: sanitise(rawData.title, 10),
    firstName: sanitise(rawData.firstName, 80),
    lastName: sanitise(rawData.lastName, 80),
    phone: sanitise(rawData.phone, 30),
    email: sanitise(rawData.email, 120).toLowerCase(),
    dateOfBirth: sanitise(rawData.dateOfBirth, 20),
    maritalStatus: sanitise(rawData.maritalStatus, 40),
    addressLine1: sanitise(rawData.addressLine1, 120),
    postcode: sanitise(rawData.postcode, 12).toUpperCase(),

    hadClaimsLastFiveYears: sanitise(rawData.hadClaimsLastFiveYears, 10),
    claimCount: sanitise(rawData.claimCount, 10),
    propertyAddress: sanitise(rawData.propertyAddress, 250),
    propertyType: sanitise(rawData.propertyType, 40),
    bedroomCount: sanitise(rawData.bedroomCount, 10),
    yearBuilt: sanitise(rawData.yearBuilt, 10),
    standardConstruction: sanitise(rawData.standardConstruction, 10),
    floodingHistory: sanitise(rawData.floodingHistory, 10),
    subsidenceHistory: sanitise(rawData.subsidenceHistory, 10),
    structuralMovementHistory: sanitise(rawData.structuralMovementHistory, 10),
    tenantType: sanitise(rawData.tenantType, 40),
    tenantCount: sanitise(rawData.tenantCount, 10),
    writtenTenancyAgreement: sanitise(rawData.writtenTenancyAgreement, 10),
    longTermLet: sanitise(rawData.longTermLet, 10),
    isHmo: sanitise(rawData.isHmo, 10),
    businessUse: sanitise(rawData.businessUse, 10),
    emptyMoreThanThirtyDays: sanitise(rawData.emptyMoreThanThirtyDays, 10),

    buildingsCover: sanitise(rawData.buildingsCover, 10),
    contentsCover: sanitise(rawData.contentsCover, 10),
    lossOfRentCover: sanitise(rawData.lossOfRentCover, 10),
    propertyOwnersLiability: sanitise(rawData.propertyOwnersLiability, 10),
    accidentalDamage: sanitise(rawData.accidentalDamage, 10),
    hasMortgage: sanitise(rawData.hasMortgage, 10),
    lenderName: sanitise(rawData.lenderName, 120),
    buyToLetMortgage: sanitise(rawData.buyToLetMortgage, 10),
    smokeAlarms: sanitise(rawData.smokeAlarms, 10),
    gasSafetyCertificate: sanitise(rawData.gasSafetyCertificate, 10),
    electricalSafetyCertificate: sanitise(
      rawData.electricalSafetyCertificate,
      10
    ),
    previousInsurerName: sanitise(rawData.previousInsurerName, 120),
    renewalDate: sanitise(rawData.renewalDate, 20),
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
    console.error("Missing landlord email configuration", {
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
    subject: `New Landlord Insurance Enquiry - ${data.firstName} ${data.lastName}`,
    html: formatInternalEmailHtml(data),
    replyTo: data.email,
  });

  if (internalEmailResult.error) {
    console.error("Landlord internal email failed", internalEmailResult.error);

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
    subject: "We've received your landlord insurance enquiry",
    html: formatCustomerEmailHtml(data.firstName || ""),
  });

  if (customerEmailResult.error) {
    console.error("Landlord customer email failed", customerEmailResult.error);

    return jsonResponse(
      {
        error: "Your acknowledgement email could not be sent.",
      },
      500
    );
  }

  console.log("Landlord quote enquiry received", {
    receivedAt: new Date().toISOString(),
    ip,
    propertyType: data.propertyType,
    tenantType: data.tenantType,
    hadClaimsLastFiveYears: data.hadClaimsLastFiveYears,
    hasMortgage: data.hasMortgage,
  });

  return jsonResponse({
    success: true,
    message: "Your enquiry has been sent successfully.",
  });
}

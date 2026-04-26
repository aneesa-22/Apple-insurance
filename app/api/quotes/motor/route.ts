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
const allowedBusinessStructures = [
  "Sole trader",
  "Partnership",
  "Limited company",
];
const allowedTradingBasis = ["Full-time", "Part-time"];
const allowedBusinessTypes = [
  "Mechanic",
  "Dealer",
  "Valeter",
  "Body repairer",
  "MOT station",
  "Recovery operator",
  "Tyre/exhaust fitter",
  "Mobile mechanic",
  "Other",
];
const allowedCoverLevels = [
  "Third Party Only",
  "Third Party Fire & Theft",
  "Comprehensive",
];
const allowedYoungestDriverAges = ["21+", "25+", "30+"];
const allowedVehicleTypes = [
  "Cars",
  "Vans",
  "Motorcycles",
  "Prestige vehicles",
  "Commercial vehicles",
];

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type MotorTradeQuotePayload = {
  website?: string;
  turnstileToken?: string;

  title?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  addressLine1?: string;
  postcode?: string;
  phone?: string;
  email?: string;
  maritalStatus?: string;

  businessStructure?: string;
  tradingBasis?: string;
  occupation?: string;
  businessName?: string;
  businessAddress?: string;
  businessType?: string;
  otherBusinessType?: string;
  runFromHome?: string;
  annualTurnover?: string;
  numberOfEmployees?: string;
  apprentices?: string;

  coverLevel?: string;
  socialDomesticPleasure?: string;
  commutingIncluded?: string;
  businessUseIncluded?: string;
  proposerVehiclesCovered?: string;
  customerVehiclesCovered?: string;
  maxVehicleValue?: string;
  maxVehicleCount?: string;
  vehicleTypes?: string[];
  highPerformanceVehicles?: string;
  overnightLocation?: string;

  youngestDriverAge?: string;
  licencePointsOrConvictions?: string;
  licencePointsDetails?: string;
  accidentsOrClaims?: string;
  claimsDetails?: string;
  insuranceCancelledDeclined?: string;
  insuranceIssuesDetails?: string;
  criminalConvictionsOrCcjs?: string;
  disclosureDetails?: string;
  startDate?: string;
  additionalNotes?: string;
};

type FieldErrors = Partial<Record<keyof MotorTradeQuotePayload, string>>;

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

function sanitiseArray(value: unknown, maxLength = 80) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => sanitise(item, maxLength))
    .filter(Boolean);
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

function isMoneyLike(value: string) {
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

function validatePayload(data: MotorTradeQuotePayload) {
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

  if (!allowedBusinessStructures.includes(data.businessStructure || "")) {
    errors.businessStructure = "Please select your business structure.";
  }

  if (!allowedTradingBasis.includes(data.tradingBasis || "")) {
    errors.tradingBasis = "Please select your trading basis.";
  }

  if (data.tradingBasis === "Part-time" && !data.occupation) {
    errors.occupation = "Please enter your occupation.";
  }

  if (!data.businessName) {
    errors.businessName = "Please enter your business name.";
  }

  if (!data.businessAddress) {
    errors.businessAddress = "Please enter your business address.";
  }

  if (!allowedBusinessTypes.includes(data.businessType || "")) {
    errors.businessType = "Please select your business type.";
  }

  if (data.businessType === "Other" && !data.otherBusinessType) {
    errors.otherBusinessType = "Please specify your business type.";
  }

  if (!allowedYesNo.includes(data.runFromHome || "")) {
    errors.runFromHome = "Please tell us if the business is run from home.";
  }

  if (!data.annualTurnover) {
    errors.annualTurnover = "Please enter your annual turnover.";
  } else if (!isMoneyLike(data.annualTurnover)) {
    errors.annualTurnover = "Please enter a valid annual turnover.";
  }

  if (!data.numberOfEmployees) {
    errors.numberOfEmployees = "Please enter the number of employees.";
  } else if (!isPositiveWholeNumber(data.numberOfEmployees)) {
    errors.numberOfEmployees = "Please enter a valid number of employees.";
  }

  if (!allowedYesNo.includes(data.apprentices || "")) {
    errors.apprentices = "Please tell us if you have any apprentices.";
  }

  if (!allowedCoverLevels.includes(data.coverLevel || "")) {
    errors.coverLevel = "Please select a road risks cover level.";
  }

  for (const field of [
    "socialDomesticPleasure",
    "commutingIncluded",
    "businessUseIncluded",
    "proposerVehiclesCovered",
    "customerVehiclesCovered",
  ] as const) {
    if (!allowedYesNo.includes(data[field] || "")) {
      errors[field] = "Please select Yes or No.";
    }
  }

  if (!data.maxVehicleValue) {
    errors.maxVehicleValue = "Please enter the maximum vehicle value.";
  } else if (!isMoneyLike(data.maxVehicleValue)) {
    errors.maxVehicleValue = "Please enter a valid maximum vehicle value.";
  }

  if (!data.maxVehicleCount) {
    errors.maxVehicleCount =
      "Please enter the maximum number of vehicles at one time.";
  } else if (!isPositiveWholeNumber(data.maxVehicleCount)) {
    errors.maxVehicleCount = "Please enter a valid vehicle count.";
  }

  if (!data.vehicleTypes || data.vehicleTypes.length === 0) {
    errors.vehicleTypes = "Please select at least one vehicle type.";
  } else if (
    data.vehicleTypes.some(
      (vehicleType) => !allowedVehicleTypes.includes(vehicleType)
    )
  ) {
    errors.vehicleTypes = "Please select valid vehicle types.";
  }

  if (!data.highPerformanceVehicles) {
    errors.highPerformanceVehicles =
      "Please tell us about any high-performance vehicles.";
  }

  if (!data.overnightLocation) {
    errors.overnightLocation =
      "Please tell us where vehicles are kept overnight.";
  }

  if (!allowedYoungestDriverAges.includes(data.youngestDriverAge || "")) {
    errors.youngestDriverAge = "Please select the age of the youngest driver.";
  }

  if (!allowedYesNo.includes(data.licencePointsOrConvictions || "")) {
    errors.licencePointsOrConvictions =
      "Please tell us about any licence points or convictions.";
  }

  if (data.licencePointsOrConvictions === "Yes" && !data.licencePointsDetails) {
    errors.licencePointsDetails =
      "Please provide the points or conviction details.";
  }

  if (!allowedYesNo.includes(data.accidentsOrClaims || "")) {
    errors.accidentsOrClaims =
      "Please tell us about any accidents or claims.";
  }

  if (data.accidentsOrClaims === "Yes" && !data.claimsDetails) {
    errors.claimsDetails = "Please provide the claims details.";
  }

  if (!allowedYesNo.includes(data.insuranceCancelledDeclined || "")) {
    errors.insuranceCancelledDeclined =
      "Please tell us about any cancelled, declined, or refused insurance.";
  }

  if (
    data.insuranceCancelledDeclined === "Yes" &&
    !data.insuranceIssuesDetails
  ) {
    errors.insuranceIssuesDetails =
      "Please provide the insurance history details.";
  }

  if (!allowedYesNo.includes(data.criminalConvictionsOrCcjs || "")) {
    errors.criminalConvictionsOrCcjs =
      "Please tell us about any criminal convictions, bankruptcy, or CCJs.";
  }

  if (data.criminalConvictionsOrCcjs === "Yes" && !data.disclosureDetails) {
    errors.disclosureDetails = "Please provide the disclosure details.";
  }

  if (!data.startDate) {
    errors.startDate = "Please enter the required start date.";
  } else if (!isValidDate(data.startDate) || !isFutureOrToday(data.startDate)) {
    errors.startDate = "Please enter a valid start date.";
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

function arrayRow(label: string, value: string[] | undefined) {
  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(
    value && value.length > 0 ? value.join(", ") : "N/A"
  )}</p>`;
}

function formatInternalEmailHtml(data: MotorTradeQuotePayload) {
  return `
    <div style="font-family: Arial, sans-serif; color: #18181b;">
      <h2>New Motor Trade Quote Enquiry</h2>

      <h3>Your details</h3>
      ${row("Title", data.title)}
      ${row("First name", data.firstName)}
      ${row("Last name", data.lastName)}
      ${row("Date of birth", data.dateOfBirth)}
      ${row("First line of address", data.addressLine1)}
      ${row("Postcode", data.postcode)}
      ${row("Phone", data.phone)}
      ${row("Email", data.email)}
      ${row("Marital status", data.maritalStatus)}

      <hr style="margin: 24px 0;" />

      <h3>Business details</h3>
      ${row("Business structure", data.businessStructure)}
      ${row("Trading basis", data.tradingBasis)}
      ${row("Occupation", data.occupation)}
      ${row("Business name", data.businessName)}
      ${row("Business address", data.businessAddress)}
      ${row("Business type", data.businessType)}
      ${row("Other business type", data.otherBusinessType)}
      ${row("Run from home", data.runFromHome)}
      ${row("Annual turnover", data.annualTurnover)}
      ${row("Number of employees", data.numberOfEmployees)}
      ${row("Apprentices", data.apprentices)}

      <hr style="margin: 24px 0;" />

      <h3>Cover and vehicles</h3>
      ${row("Cover level", data.coverLevel)}
      ${row("Social, domestic & pleasure", data.socialDomesticPleasure)}
      ${row("Commuting included", data.commutingIncluded)}
      ${row("Business use included", data.businessUseIncluded)}
      ${row("Proposer vehicles covered", data.proposerVehiclesCovered)}
      ${row("Customer vehicles covered", data.customerVehiclesCovered)}
      ${row("Maximum vehicle value", data.maxVehicleValue)}
      ${row("Maximum vehicle count", data.maxVehicleCount)}
      ${arrayRow("Vehicle types", data.vehicleTypes)}
      ${row("High-performance vehicles", data.highPerformanceVehicles)}
      ${row("Overnight location", data.overnightLocation)}

      <hr style="margin: 24px 0;" />

      <h3>Drivers and history</h3>
      ${row("Youngest driver age", data.youngestDriverAge)}
      ${row("Licence points or convictions", data.licencePointsOrConvictions)}
      ${row("Licence points details", data.licencePointsDetails)}
      ${row("Accidents or claims", data.accidentsOrClaims)}
      ${row("Claims details", data.claimsDetails)}
      ${row("Insurance cancelled / declined", data.insuranceCancelledDeclined)}
      ${row("Insurance issues details", data.insuranceIssuesDetails)}
      ${row("Criminal convictions or CCJs", data.criminalConvictionsOrCcjs)}
      ${row("Disclosure details", data.disclosureDetails)}
      ${row("Start date", data.startDate)}
      ${row("Additional notes", data.additionalNotes)}
    </div>
  `;
}

function formatCustomerEmailHtml(firstName: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #18181b;">
      <h2>We’ve received your motor trade enquiry</h2>
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

  let rawData: MotorTradeQuotePayload;

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

  const data: MotorTradeQuotePayload = {
    title: sanitise(rawData.title, 10),
    firstName: sanitise(rawData.firstName, 80),
    lastName: sanitise(rawData.lastName, 80),
    dateOfBirth: sanitise(rawData.dateOfBirth, 20),
    addressLine1: sanitise(
      rawData.addressLine1 ?? (rawData as Record<string, unknown>).homeAddress,
      120
    ),
    postcode: sanitise(rawData.postcode, 12).toUpperCase(),
    phone: sanitise(rawData.phone, 30),
    email: sanitise(rawData.email, 120).toLowerCase(),
    maritalStatus: sanitise(rawData.maritalStatus, 40),

    businessStructure: sanitise(rawData.businessStructure, 40),
    tradingBasis: sanitise(rawData.tradingBasis, 40),
    occupation: sanitise(rawData.occupation, 120),
    businessName: sanitise(rawData.businessName, 120),
    businessAddress: sanitise(rawData.businessAddress, 250),
    businessType: sanitise(rawData.businessType, 80),
    otherBusinessType: sanitise(rawData.otherBusinessType, 120),
    runFromHome: sanitise(rawData.runFromHome, 10),
    annualTurnover: sanitise(rawData.annualTurnover, 40),
    numberOfEmployees: sanitise(rawData.numberOfEmployees, 10),
    apprentices: sanitise(rawData.apprentices, 10),

    coverLevel: sanitise(rawData.coverLevel, 40),
    socialDomesticPleasure: sanitise(rawData.socialDomesticPleasure, 10),
    commutingIncluded: sanitise(rawData.commutingIncluded, 10),
    businessUseIncluded: sanitise(rawData.businessUseIncluded, 10),
    proposerVehiclesCovered: sanitise(rawData.proposerVehiclesCovered, 10),
    customerVehiclesCovered: sanitise(rawData.customerVehiclesCovered, 10),
    maxVehicleValue: sanitise(rawData.maxVehicleValue, 40),
    maxVehicleCount: sanitise(rawData.maxVehicleCount, 10),
    vehicleTypes: sanitiseArray(rawData.vehicleTypes, 80),
    highPerformanceVehicles: sanitise(rawData.highPerformanceVehicles, 120),
    overnightLocation: sanitise(rawData.overnightLocation, 120),

    youngestDriverAge: sanitise(rawData.youngestDriverAge, 10),
    licencePointsOrConvictions: sanitise(
      rawData.licencePointsOrConvictions,
      10
    ),
    licencePointsDetails: sanitise(rawData.licencePointsDetails, 500),
    accidentsOrClaims: sanitise(rawData.accidentsOrClaims, 10),
    claimsDetails: sanitise(rawData.claimsDetails, 500),
    insuranceCancelledDeclined: sanitise(
      rawData.insuranceCancelledDeclined,
      10
    ),
    insuranceIssuesDetails: sanitise(rawData.insuranceIssuesDetails, 500),
    criminalConvictionsOrCcjs: sanitise(rawData.criminalConvictionsOrCcjs, 10),
    disclosureDetails: sanitise(rawData.disclosureDetails, 500),
    startDate: sanitise(rawData.startDate, 20),
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
    console.error("Missing motor trade email configuration", {
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
      subject: `New Motor Trade Quote Enquiry - ${data.firstName} ${data.lastName}`,
      html: formatInternalEmailHtml(data),
      replyTo: data.email,
    });
  } catch (error) {
    console.error("Motor trade internal email failed", error);

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
      subject: "We’ve received your motor trade enquiry",
      html: formatCustomerEmailHtml(data.firstName || ""),
    });
  } catch (error) {
    console.error("Motor trade customer email failed", error);

    return jsonResponse(
      {
        error: "Your acknowledgement email could not be sent.",
      },
      500
    );
  }

  console.log("Motor trade quote enquiry received", {
    receivedAt: new Date().toISOString(),
    ip,
    businessType: data.businessType,
    tradingBasis: data.tradingBasis,
    vehicleTypeCount: data.vehicleTypes?.length || 0,
    youngestDriverAge: data.youngestDriverAge,
  });

  return jsonResponse({
    success: true,
    message: "Your enquiry has been sent successfully.",
  });
}

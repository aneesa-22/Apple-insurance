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

const allowedEnquiryTypes = [
  "Taxi Insurance",
  "Home Insurance",
  "Property Insurance",
  "Motor Trade Insurance",
  "Car Insurance",
  "Travel Insurance",
  "Complaints",
  "General Enquiry",
];

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type ContactPayload = {
  website?: string;
  turnstileToken?: string;

  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  enquiryType?: string;
  message?: string;
};

type FieldErrors = Partial<Record<keyof ContactPayload, string>>;

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

function isValidName(value: string) {
  return /^[A-Za-zÀ-ÿ' -]+$/.test(value);
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

function validatePayload(data: ContactPayload) {
  const errors: FieldErrors = {};

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

  if (!allowedEnquiryTypes.includes(data.enquiryType || "")) {
    errors.enquiryType = "Please select a valid enquiry type.";
  }

  if (!data.message) {
    errors.message = "Please enter your message.";
  } else if (data.message.length < 10) {
    errors.message = "Your message must be at least 10 characters.";
  } else if (data.message.length > 3000) {
    errors.message = "Your message must be under 3000 characters.";
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

function formatInternalEmailHtml(data: ContactPayload) {
  return `
    <div style="font-family: Arial, sans-serif; color: #18181b;">
      <h2>New Contact Enquiry</h2>
      ${row("First name", data.firstName)}
      ${row("Last name", data.lastName)}
      ${row("Phone", data.phone)}
      ${row("Email", data.email)}
      ${row("Enquiry type", data.enquiryType)}
      ${row("Message", data.message)}
    </div>
  `;
}

function formatCustomerEmailHtml(firstName: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #18181b;">
      <h2>We’ve received your message</h2>
      <p>Hi ${escapeHtml(firstName || "there")},</p>
      <p>Thank you for contacting Apple Insurance Services.</p>
      <p>We’ve received your enquiry and a member of our team will review it and get back to you as soon as possible.</p>
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

  let rawData: ContactPayload;

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

  const data: ContactPayload = {
    firstName: sanitise(rawData.firstName, 80),
    lastName: sanitise(rawData.lastName, 80),
    phone: sanitise(rawData.phone, 30),
    email: sanitise(rawData.email, 120).toLowerCase(),
    enquiryType: sanitise(rawData.enquiryType, 80),
    message: sanitise(rawData.message, 3000),
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
    console.error("Missing contact email configuration", {
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
    subject: `New ${data.enquiryType} Enquiry - ${data.firstName} ${data.lastName}`,
    html: formatInternalEmailHtml(data),
    replyTo: data.email,
  });

  if (internalEmailResult.error) {
    console.error("Contact internal email failed", internalEmailResult.error);

    return jsonResponse(
      {
        error: "Your message could not be sent. Please try again or call us.",
      },
      500
    );
  }

  const customerEmailResult = await resend.emails.send({
    from: fromEmail,
    to: data.email || "",
    subject: "We’ve received your message",
    html: formatCustomerEmailHtml(data.firstName || ""),
  });

  if (customerEmailResult.error) {
    console.error("Contact customer email failed", customerEmailResult.error);

    return jsonResponse(
      {
        error: "Your acknowledgement email could not be sent.",
      },
      500
    );
  }

  console.log("Contact enquiry received", {
    receivedAt: new Date().toISOString(),
    ip,
    enquiryType: data.enquiryType,
    hasMessage: Boolean(data.message),
  });

  return jsonResponse({
    success: true,
    message: "Your message has been sent successfully.",
  });
}

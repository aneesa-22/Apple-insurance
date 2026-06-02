"use client";

import Link from "next/link";
import { Instrument_Sans } from "next/font/google";
import { useState } from "react";
import PageFooter from "../site/PageFooter";
import QuotePageHeader from "../quote/QuotePageHeader";
import QuoteReassurancePanel from "../quote/QuoteReassurancePanel";
import BackToHomeLink from "../site/BackToHomeLink";
import TurnstileWidget from "./TurnstileWidget";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type SimpleInsuranceContactPageProps = {
  enquiryType: "Car Insurance" | "Travel Insurance";
  eyebrow: string;
  heading: string;
  intro: string;
  partnerQuote?: {
    title: string;
    copy: string;
    buttonLabel: string;
    href: string;
    note: string;
    followUp: string;
  };
};

export default function SimpleInsuranceContactPage({
  enquiryType,
  eyebrow,
  heading,
  intro,
  partnerQuote,
}: SimpleInsuranceContactPageProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      if (!turnstileToken) {
        setSubmitError("Please complete the captcha verification.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          enquiryType,
          turnstileToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(result.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitSuccess(true);
      setTurnstileToken("");
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`${instrumentSans.className} min-h-screen bg-white text-zinc-950`}>
      <QuotePageHeader activePage="none" />

      <div className="px-4 py-8 sm:px-8 sm:py-12 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8 sm:mb-10">
            <BackToHomeLink className="mb-8" />

            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#7f1d1d]">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#10203d] sm:text-4xl">
              {heading}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
              {intro}
            </p>
          </div>

          {partnerQuote && (
            <section className="mb-8 rounded-[1.75rem] border border-zinc-200 bg-[#f7f4ef] p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:mb-10 sm:rounded-3xl sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-[22px] font-bold tracking-tight text-[#10203d] sm:text-3xl">
                    {partnerQuote.title}
                  </h2>
                  <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                    {partnerQuote.copy}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-zinc-500">
                    {partnerQuote.note}
                  </p>
                  <p className="mt-4 text-[15px] leading-7 text-[#10203d] sm:text-[16px]">
                    {partnerQuote.followUp}
                  </p>
                </div>

                <a
                  href={partnerQuote.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 shrink-0 items-center justify-center gap-3 rounded-[1.15rem] bg-[#10203d] px-7 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(16,32,61,0.18)] transition-colors hover:bg-[#183056]"
                >
                  {partnerQuote.buttonLabel}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </section>
          )}

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
            <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
              <h2 className="text-[21px] font-semibold tracking-tight text-[#10203d] sm:text-2xl">
                Send us a message
              </h2>
              <p className="mt-2 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                Fill in your details below and we&apos;ll point your enquiry to the
                right member of the team.
              </p>

              <div className="mt-8 grid gap-5 sm:gap-6">
                <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-semibold text-[#10203d]"
                    >
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          firstName: event.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-semibold text-[#10203d]"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          lastName: event.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-[#10203d]"
                    >
                      Phone number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          phone: event.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-[#10203d]"
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          email: event.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-[#10203d]"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Tell us a little about what you need help with"
                    value={formData.message}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        message: event.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                  />
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold text-[#10203d]">
                    Verification
                  </p>
                  <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-[0_4px_14px_rgba(8,18,37,0.04)]">
                    <TurnstileWidget
                      enabled={true}
                      onVerify={(token) => {
                        setTurnstileToken(token);
                        setSubmitError("");
                      }}
                      onExpire={() => setTurnstileToken("")}
                      onError={() => setTurnstileToken("")}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                {submitError && (
                  <div className="rounded-2xl border border-[#7f1d1d]/20 bg-[#fdf1f1] px-5 py-4">
                    <p className="text-sm font-semibold text-[#7f1d1d]">
                      We couldn&apos;t send your message just now.
                    </p>
                    <p className="mt-1 text-sm leading-6 text-zinc-700">
                      Please try again, or call us on <strong>0161 881 2139</strong>.
                    </p>
                  </div>
                )}

                {submitSuccess ? (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-5">
                    <p className="text-sm font-semibold text-green-700">
                      Your message has been sent successfully.
                    </p>
                    <p className="mt-1 text-sm leading-6 text-zinc-700">
                      We&apos;ve also sent a confirmation email to you, and a member
                      of our team will be in touch soon.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-[#10203d] bg-[#10203d] px-8 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#183056] active:bg-[#2a4a6a] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                  >
                    {isSubmitting ? "Sending..." : "Send message →"}
                  </button>
                )}
              </div>
            </section>

            <QuoteReassurancePanel />
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="text-sm font-semibold text-[#7f1d1d] transition-colors hover:text-[#5f1414]"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </div>

      <PageFooter />
    </main>
  );
}

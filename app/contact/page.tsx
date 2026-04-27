"use client";

import Link from "next/link";
import { useState } from "react";
import { Libre_Baskerville, Instrument_Sans } from "next/font/google";
import PageFooter from "../components/site/PageFooter";
import BackToHomeLink from "../components/site/BackToHomeLink";
import TurnstileWidget from "../components/forms/TurnstileWidget";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    enquiryType: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        enquiryType: "",
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
      <header className="bg-[radial-gradient(circle_at_top_left,_rgba(127,29,29,0.22),_transparent_24%),linear-gradient(135deg,#07101f_0%,#0c1730_55%,#081225_100%)]">
<div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pt-10 pb-6 sm:px-8 sm:pb-8 sm:pt-20">
          <div className="flex items-start justify-between gap-4 sm:gap-6">
            <Link href="/" className="relative shrink-0">
              <img
                src="/icons/logo.png"
                alt=""
                aria-hidden="true"
                className="absolute -left-5 -top-19 h-40 w-40 object-contain opacity-80 sm:-left-9 sm:-top-28 sm:h-60 sm:w-60"
              />

              <div className="relative z-10 pl-10 sm:pl-16">
                <p
                  className={`${libreBaskerville.className} text-[20px] font-bold leading-[0.95] tracking-tight text-white sm:text-[36px]`}
                >
                  Apple
                </p>
                <p
                  className={`${libreBaskerville.className} -mt-1 text-[20px] font-bold leading-[0.95] tracking-tight text-white sm:text-[36px]`}
                >
                  Insurance
                </p>
                <p className="mt-0.5 pl-[2px] text-[9px] font-medium uppercase tracking-[0.26em] text-[#7f1d1d] sm:mt-2 sm:text-[13px]">
                  Services
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-2xl text-white transition-colors hover:border-[#7f1d1d] hover:text-[#7f1d1d] active:border-[#7f1d1d] active:text-[#7f1d1d] lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? "×" : "☰"}
            </button>

            <nav className="hidden flex-1 items-center justify-end gap-10 pt-2 text-[17px] text-zinc-300 lg:flex lg:text-[19px]">
              <Link
                href="/quotes/taxi"
                className="group relative whitespace-nowrap font-medium text-white transition-colors duration-200"
              >
                <span>Taxi</span>
                <span className="absolute left-1/2 top-full mt-2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#7f1d1d] transition-all duration-200 group-hover:w-full" />
              </Link>

              <Link
                href="/quotes/home"
                className="group relative whitespace-nowrap font-medium text-zinc-300 transition-colors duration-200 hover:text-white"
              >
                <span>Home</span>
                <span className="absolute left-1/2 top-full mt-2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#7f1d1d] transition-all duration-200 group-hover:w-full" />
              </Link>

              <Link
                href="/quotes/landlord"
                className="group relative whitespace-nowrap font-medium text-zinc-300 transition-colors duration-200 hover:text-white"
              >
                <span>Landlord</span>
                <span className="absolute left-1/2 top-full mt-2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#7f1d1d] transition-all duration-200 group-hover:w-full" />
              </Link>

              <Link
                href="/quotes/motor"
                className="group relative whitespace-nowrap font-medium text-zinc-300 transition-colors duration-200 hover:text-white"
              >
                <span>Motor</span>
                <span className="absolute left-1/2 top-full mt-2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#7f1d1d] transition-all duration-200 group-hover:w-full" />
              </Link>

              <Link
                href="/about"
                className="group relative whitespace-nowrap font-medium text-zinc-300 transition-colors duration-200 hover:text-white"
              >
                <span>About Us</span>
                <span className="absolute left-1/2 top-full mt-2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#7f1d1d] transition-all duration-200 group-hover:w-full" />
              </Link>

              <Link
                href="/contact"
                className="group relative whitespace-nowrap font-medium text-zinc-300 transition-colors duration-200 hover:text-white"
              >
                <span>Contact</span>
                <span className="absolute left-1/2 top-full mt-2 h-[3px] w-full -translate-x-1/2 rounded-full bg-[#7f1d1d]" />
              </Link>
            </nav>
          </div>

          {mobileMenuOpen && (
            <nav className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-5 text-[17px] text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:hidden">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-white/10 py-3 font-medium transition-colors hover:text-[#7f1d1d] active:text-[#7f1d1d]"
              >
                Homepage
              </Link>

              <Link
                href="/quotes/taxi"
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-white/10 py-3 font-medium text-white transition-colors hover:text-[#7f1d1d] active:text-[#7f1d1d]"
              >
                Taxi
              </Link>

              <Link
                href="/quotes/home"
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-white/10 py-3 font-medium transition-colors hover:text-[#7f1d1d] active:text-[#7f1d1d]"
              >
                Home
              </Link>

              <Link
                href="/quotes/landlord"
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-white/10 py-3 font-medium transition-colors hover:text-[#7f1d1d] active:text-[#7f1d1d]"
              >
                Landlord
              </Link>

              <Link
                href="/quotes/motor"
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-white/10 py-3 font-medium transition-colors hover:text-[#7f1d1d] active:text-[#7f1d1d]"
              >
                Motor
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-white/10 py-3 font-medium transition-colors hover:text-[#7f1d1d] active:text-[#7f1d1d]"
              >
                About Us
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 font-medium transition-colors hover:text-[#7f1d1d] active:text-[#7f1d1d]"
              >
                Contact
              </Link>
            </nav>
          )}
        </div>
      </header>

      <div className="px-4 py-8 sm:px-8 sm:py-12 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8 sm:mb-10">
            <BackToHomeLink className="mb-8" />

            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#7f1d1d]">
              Contact Us
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#081225] sm:text-4xl">
              Get in touch
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
              Call, email, or send us a message and our team will get back to
              you as soon as possible.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
            <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
              <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
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
                      className="mb-2 block text-sm font-semibold text-[#081225]"
                    >
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-semibold text-[#081225]"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastName: e.target.value,
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
                      className="mb-2 block text-sm font-semibold text-[#081225]"
                    >
                      Phone number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-[#081225]"
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="enquiryType"
                    className="mb-2 block text-sm font-semibold text-[#081225]"
                  >
                    What do you need help with?
                  </label>

                  <div className="relative">
                    <select
                      id="enquiryType"
                      value={formData.enquiryType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          enquiryType: e.target.value,
                        })
                      }
                      className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 pr-12 text-[15px] text-zinc-900 outline-none transition-colors focus:border-[#7f1d1d] sm:text-base"
                    >
                      <option value="">Select an enquiry type</option>
                      <option value="Taxi Insurance">Taxi Insurance</option>
                      <option value="Home Insurance">Home Insurance</option>
                      <option value="Property Insurance">Property Insurance</option>
                      <option value="Motor Trade Insurance">Motor Trade Insurance</option>
                      <option value="Complaints">Complaints</option>
                      <option value="General Enquiry">General Enquiry</option>
                    </select>

                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-zinc-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-[#081225]"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Tell us a little about what you need help with"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        message: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                  />
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold text-[#081225]">
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
                  <div>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="inline-flex h-14 items-center justify-center rounded-2xl border border-[#081225] bg-[#081225] px-8 text-[15px] font-semibold text-white transition-colors hover:bg-[#13203a] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                    >
                      {isSubmitting ? "Sending..." : "Send message"}
                    </button>
                  </div>
                )}
              </div>
            </section>

            <aside className="rounded-[1.75rem] bg-[#f7f4ef] p-5 sm:rounded-3xl sm:p-8">
              <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                Contact details
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                If you would rather speak to someone directly, our team is happy
                to help.
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src="/icons/phone.svg"
                      alt="Phone icon"
                      className="h-5 w-5 object-contain"
                    />
                    <h3 className="text-lg font-semibold tracking-tight text-[#081225]">
                      Call us
                    </h3>
                  </div>

                  <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                    <a
                      href="tel:01618812139"
                      className="font-semibold text-[#7f1d1d] transition-colors hover:text-[#5f1414]"
                    >
                      0161 881 2139
                    </a>
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src="/icons/envelope.svg"
                      alt="Email icon"
                      className="h-5 w-5 object-contain"
                    />
                    <h3 className="text-lg font-semibold tracking-tight text-[#081225]">
                      Email us
                    </h3>
                  </div>

                  <p className="mt-3 break-words text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                    <a
                      href="mailto:appleinsuranceservices@yahoo.co.uk"
                      className="font-semibold text-[#7f1d1d] transition-colors hover:text-[#5f1414]"
                    >
                      appleinsuranceservices@yahoo.co.uk
                    </a>
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src="/icons/map.svg"
                      alt="Map icon"
                      className="h-5 w-5 object-contain"
                    />
                    <h3 className="text-lg font-semibold tracking-tight text-[#081225]">
                      Visit us
                    </h3>
                  </div>

                  <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                    Apple Insurance Services
                    <br />
                    363 Barlow Moor Rd
                    <br />
                    Chorlton-cum-Hardy
                    <br />
                    Manchester M21 7FZ
                  </p>
                </div>

                <div className="border-t border-zinc-200 pt-6">
                  <h3 className="text-lg font-semibold tracking-tight text-[#081225]">
                    What happens next
                  </h3>
                  <p className="mt-2 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                    Once you send your message, a member of our team will review
                    it and get back to you as soon as possible.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#7f1d1d]/10 bg-white px-5 py-5">
                  <h3 className="text-lg font-semibold tracking-tight text-[#081225]">
                    Looking for cover?
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600">
                    If you already know the type of insurance you need, head to our
                    quote page and choose the right option for you.
                  </p>

                  <Link
                    className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl border border-[#7f1d1d] px-5 text-sm font-semibold text-[#7f1d1d] transition-colors hover:bg-[#7f1d1d] hover:text-white"
                    href="/#find-cover"
                    onClick={(e) => {
                      const isHomePage = window.location.pathname === "/";
                      const el = document.getElementById("find-cover");

                      if (isHomePage && el) {
                        e.preventDefault();
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                        window.history.replaceState(null, "", "#find-cover");
                      }
                    }}
                  >
                    Get a quote
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <PageFooter />
    </main>
  );
}

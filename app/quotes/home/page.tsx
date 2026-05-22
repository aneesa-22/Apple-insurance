"use client";

import Link from "next/link";
import { Instrument_Sans } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import PageFooter from "../../components/site/PageFooter";
import QuotePageHeader from "../../components/quote/QuotePageHeader";
import QuotePageHero from "../../components/quote/QuotePageHero";
import QuoteReassurancePanel from "../../components/quote/QuoteReassurancePanel";
import { quotePrimaryButtonClass, quoteSecondaryButtonClass } from "../../components/quote/quoteButtonClasses";
import YourDetailsStep from "../../components/forms/YourDetailsStep";
import validateYourDetails from "../../components/lib/validateYourDetails";
import TurnstileWidget from "../../components/forms/TurnstileWidget";
import { SubmitErrorBox } from "../../components/forms/FormFeedback";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function HomeQuotePage() {
  const [step, setStep] = useState(1);
  const formTopRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    maritalStatus: "",
    addressLine1: "",
    postcode: "",
    propertyType: "",
    bedroomCount: "",
    livingRoomCount: "",
    toiletCount: "",
    yearBuilt: "",
    flatRoof: "",
    sumInsured: "",
    hadClaims: "",
    claimCount: "",
    additionalNotes: "",
  });

  type FormField = keyof typeof formData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FormField, string>>
  >({});

  useEffect(() => {
    formTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [step]);

  const isPositiveWholeNumber = (value: string) =>
    /^\d+$/.test(value) && Number(value) >= 0;

  const isMoneyLike = (value: string) =>
    /^[\d\s,£.]+$/.test(value) && /\d/.test(value);

  const updateField = (field: FormField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    setSubmitError("");
  };


  const validateStepOne = () => {
    const errors = validateYourDetails(formData);

    setFieldErrors(errors);
    setSubmitError(
      Object.keys(errors).length > 0
        ? "Please complete the highlighted fields."
        : ""
    );

    return Object.keys(errors).length === 0;
  };

  const validateStepTwo = () => {
    const errors: Partial<Record<FormField, string>> = {};

    if (!formData.propertyType) {
      errors.propertyType = "Please select your property type.";
    }

    if (!formData.bedroomCount.trim()) {
      errors.bedroomCount = "Please enter the number of bedrooms.";
    } else if (!isPositiveWholeNumber(formData.bedroomCount)) {
      errors.bedroomCount = "Please enter a valid number of bedrooms.";
    }

    if (!formData.livingRoomCount.trim()) {
      errors.livingRoomCount = "Please enter the number of living rooms.";
    } else if (!isPositiveWholeNumber(formData.livingRoomCount)) {
      errors.livingRoomCount = "Please enter a valid number of living rooms.";
    }

    if (!formData.toiletCount.trim()) {
      errors.toiletCount = "Please enter the number of bathrooms / WCs.";
    } else if (!isPositiveWholeNumber(formData.toiletCount)) {
      errors.toiletCount = "Please enter a valid number of bathrooms / WCs.";
    }

    if (!formData.yearBuilt.trim()) {
      errors.yearBuilt = "Please enter the year built.";
    } else if (!/^\d{4}$/.test(formData.yearBuilt.trim())) {
      errors.yearBuilt = "Please enter a valid 4-digit year.";
    }

    if (!formData.flatRoof) {
      errors.flatRoof = "Please tell us if there is any flat roof.";
    }

    if (!formData.sumInsured.trim()) {
      errors.sumInsured = "Please enter the cover amount.";
    } else if (!isMoneyLike(formData.sumInsured)) {
      errors.sumInsured = "Please enter a valid cover amount.";
    }

    if (!formData.hadClaims) {
      errors.hadClaims = "Please tell us if you have had any claims.";
    }

    if (formData.hadClaims === "Yes") {
      const claimCount = Number(formData.claimCount);

      if (!formData.claimCount.trim()) {
        errors.claimCount = "Please enter how many claims you have had.";
      } else if (
        !Number.isInteger(claimCount) ||
        claimCount < 1 ||
        claimCount > 20
      ) {
        errors.claimCount = "Please enter a valid number of claims.";
      }
    }





    setFieldErrors(errors);
    setSubmitError(
      Object.keys(errors).length > 0
        ? "Please complete the highlighted fields."
        : ""
    );

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStepOne()) {
      setStep(1);
      return;
    }

    if (!validateStepTwo()) {
      setStep(2);
      return;
    }
      if (!turnstileToken) {
        setSubmitError("Please complete the captcha verification.");
        return;
      }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
  const response = await fetch("/api/quotes/home", {
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

        if (result.errors) {
          setFieldErrors(result.errors);
        }

        return;
      }

      setSubmitSuccess(true);
      setFieldErrors({});
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <main className={`${instrumentSans.className} min-h-screen bg-white text-zinc-950`}>
      <QuotePageHeader activePage="home" />
      <QuotePageHero
        eyebrow="HOME INSURANCE"
        heading="Tailored cover for homeowners and family properties."
        supportingText="Trusted by thousands of UK customers."
      />

      <div className="px-4 py-8 sm:px-8 sm:py-12 lg:px-16">
        <div ref={formTopRef} className="mx-auto w-full max-w-6xl">
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-[#7f1d1d]">
                Step {step} of 2
              </p>
              <p className="text-sm text-zinc-500">
                {step === 1 ? "Your details" : "Quote details"}
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200">
              <div
                className={`h-full rounded-full bg-[#7f1d1d] transition-all duration-300 ${
                  step === 1 ? "w-1/2" : "w-full"
                }`}
              />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
            {step === 1 ? (
              <YourDetailsStep
                                formData={formData}
                                updateField={updateField}
                                fieldErrors={fieldErrors}
                              >
                                <SubmitErrorBox message={submitError} />
              
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!validateStepOne()) return;
                                    setSubmitError("");
                                    setStep(2);
                                  }}
                                  className={quotePrimaryButtonClass}
                                >
                  Next <span aria-hidden="true">→</span>
                </button>
                              </YourDetailsStep>
            ) : (
              <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#10203d] sm:text-2xl">
                  Your property details
                </h2>
                <p className="mt-2 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Add any home insurance details you have.
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  It only takes a few details to get started. We’ll guide you through the rest.
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Your information is kept secure and only used to provide your quote.
                </p>

                <div className="mt-8 grid gap-5 sm:gap-6">
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-[#10203d]">
                      Type of property
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        "Flat",
                        "Semi-detached",
                        "Detached",
                        "Terraced",
                        "Bungalow",
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              propertyType: option,
                            })
                          }
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.propertyType === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
</div>
                 <div className="grid gap-5 sm:grid-cols-3 sm:gap-6 sm:items-end">

                    <div>
                      <label
                        htmlFor="bedroomCount"
                        className="mb-2 block text-sm font-semibold text-[#10203d]"
                      >
                        Number of bedrooms
                      </label>
                      <input
                        id="bedroomCount"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.bedroomCount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bedroomCount: e.target.value,
                          })
                        }
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="livingRoomCount"
                        className="mb-2 block text-sm font-semibold text-[#10203d]"
                      >
                         Number of living rooms
                      </label>
                      <input
                        id="livingRoomCount"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.livingRoomCount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            livingRoomCount: e.target.value,
                          })
                        }
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="toiletCount"
                        className="mb-2 block text-sm font-semibold text-[#10203d]"
                      >
                        Number of bathrooms / WCs
                      </label>
                      <input
                        id="toiletCount"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.toiletCount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            toiletCount: e.target.value,
                          })
                        }
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label
                        htmlFor="yearBuilt"
                        className="mb-2 block text-sm font-semibold text-[#10203d]"
                      >
                        Year built
                      </label>
                      <input
                        id="yearBuilt"
                        type="text"
                        placeholder="e.g. 1985"
                        value={formData.yearBuilt}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            yearBuilt: e.target.value,
                          })
                        }
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#10203d]">
                       Any flat roof?
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {["Yes", "No"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                flatRoof: option,
                              })
                            }
                            className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                              formData.flatRoof === option
                                ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                                : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="sumInsured"
                      className="mb-2 block text-sm font-semibold text-[#10203d]"
                    >
                      Cover amount (£)
                    </label>
                    <input
                      id="sumInsured"
                      type="text"
                      placeholder="e.g. 200,000"
                      value={formData.sumInsured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sumInsured: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                  </div>

                  <div className="space-y-7 sm:space-y-8">
                          <div>
                            <label className="mb-3 block text-sm font-semibold text-[#10203d]">
                              Any claims in the last 5 years?
                            </label>

                            <div className="grid gap-3 sm:grid-cols-2">
                              {["Yes", "No"].map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      hadClaims: option,
                                      claimCount: option === "No" ? "" : formData.claimCount,
                                    })
                                  }
                                  className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                                    formData.hadClaims === option
                                      ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                                      : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>

                            {formData.hadClaims === "Yes" && (
                              <div className="mt-5">
                                <label
                                  htmlFor="claimCount"
                                  className="mb-2 block text-sm font-semibold text-[#10203d]"
                                >
                                  How many claims?
                                </label>
                                <input
                                  id="claimCount"
                                  type="number"
                                  min="1"
                                  placeholder="Enter number of claims"
                                  value={formData.claimCount}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      claimCount: e.target.value,
                                    })
                                  }
                                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                                />
                              </div>
                            )}
                          </div>

                          </div>

                <div className="mt-6">
                  <label
                    htmlFor="additionalNotes"
                    className="mb-2 block text-sm font-semibold text-[#10203d]"
                  >
                    Additional details{" "}
                    <span className="font-normal text-zinc-500">(Optional)</span>
                  </label>
                  <textarea
                    id="additionalNotes"
                    rows={5}
                    placeholder="Add anything that may help with your quote"
                    value={formData.additionalNotes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additionalNotes: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                  />
                </div>

                      <div className="mt-6">
                          <p className="mb-3 text-sm font-semibold text-[#10203d]">
                            Verification
                          </p>

  <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-[0_4px_14px_rgba(8,18,37,0.04)]">

                          <TurnstileWidget
                            enabled={step === 2}
                            onVerify={(token) => {
                              setTurnstileToken(token);
                              setSubmitError("");
                            }}
                            onExpire={() => setTurnstileToken("")}
                            onError={() => setTurnstileToken("")}
                          />
                        </div>
</div>
                <div className="mt-10 space-y-4">
                  {submitError && (
                    <div className="rounded-2xl border border-[#7f1d1d]/20 bg-[#fdf1f1] px-5 py-4">
                      <p className="text-sm font-semibold text-[#7f1d1d]">
                        We couldn&apos;t send your enquiry just now.
                      </p>
                      <p className="mt-1 text-sm leading-6 text-zinc-700">
                        Please try again, or call us on <strong>0161 881 2139</strong>.
                      </p>
                    </div>
                  )}

                  {submitSuccess ? (
                    <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-5">
                      <p className="text-sm font-semibold text-green-700">
                        Your enquiry has been sent successfully.
                      </p>
                      <p className="mt-1 text-sm leading-6 text-zinc-700">
                        We&apos;ve also sent a confirmation email to you, and a member
                        of our team will be in touch soon.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className={quoteSecondaryButtonClass}
                      >
                  <span aria-hidden="true">←</span> Back
                </button>

                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={quotePrimaryButtonClass}
                      >
                        {isSubmitting ? "Submitting..." : <>Submit enquiry <span aria-hidden="true">→</span></>}
                      </button>
                    </div>
                  )}
<div className="mt-3 text-sm leading-6 text-zinc-500">
                      By submitting this form, you agree to our{" "}
                      <Link
                        href="/privacy-notice"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#7f1d1d] transition-colors hover:text-[#5f1414]"
                      >
                        Privacy Notice
                      </Link>{" "}
                      and consent to us contacting you regarding your enquiry.
                    </div>
                  
                </div>
              </section>
            )}

            <QuoteReassurancePanel />
          </div>
        </div>
      </div>

     <PageFooter />
    </main>
  );
}

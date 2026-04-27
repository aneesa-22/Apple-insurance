"use client";

import Link from "next/link";
import { Libre_Baskerville, Instrument_Sans } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import PageFooter from "../../components/site/PageFooter";
import PageHeader from "../../components/site/PageHeader";
import BackToHomeLink from "../../components/site/BackToHomeLink";
import YourDetailsStep from "../../components/forms/YourDetailsStep";
import validateYourDetails from "../../components/lib/validateYourDetails";
import TurnstileWidget from "../../components/forms/TurnstileWidget";


const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

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
    policyCancelledDeclinedVoided: "",
    criminalConvictionsOrCcjs: "",
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

  const FieldError = ({ field }: { field: FormField }) => {
    if (!fieldErrors[field]) return null;

    return (
      <p className="mt-2 text-sm font-medium text-[#7f1d1d]">
        {fieldErrors[field]}
      </p>
    );
  };

  const ErrorBox = () => {
    if (!submitError) return null;

    return (
      <div className="rounded-2xl border border-[#7f1d1d]/20 bg-[#fdf1f1] px-5 py-4">
        <p className="text-sm font-semibold text-[#7f1d1d]">{submitError}</p>
      </div>
    );
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

    if (!formData.policyCancelledDeclinedVoided) {
      errors.policyCancelledDeclinedVoided =
        "Please tell us if a policy has ever been cancelled, declined, or voided.";
    }

    if (!formData.criminalConvictionsOrCcjs) {
      errors.criminalConvictionsOrCcjs =
        "Please tell us if you have any criminal convictions, bankruptcy, or CCJs.";
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
      <PageHeader activePage ="home" />

      <div className="px-4 py-8 sm:px-8 sm:py-12 lg:px-16">
        <div ref={formTopRef} className="mx-auto w-full max-w-6xl">
          <div className="mb-8 sm:mb-10">
            <BackToHomeLink className="mb-8" />

            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#7f1d1d]">
              Home Insurance
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#081225] sm:text-4xl">
              Let&apos;s find the right home insurance for you
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
              Tell us a few details and we’ll review your enquiry and call you back to talk through your options.
            </p>
          </div>

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
                                <ErrorBox />
              
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!validateStepOne()) return;
                                    setSubmitError("");
                                    setStep(2);
                                  }}
                                  className="inline-flex h-14 w-full items-center justify-center rounded-2xl border border-[#081225] bg-[#081225] px-8 text-[15px] font-semibold text-white transition-colors hover:bg-[#13203a] sm:w-auto sm:text-base"
                                >
                                  Next
                                </button>
                              </YourDetailsStep>
            ) : (
              <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
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
                    <label className="mb-2 block text-sm font-semibold text-[#081225]">
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
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                 <div className="grid gap-5 sm:grid-cols-3 sm:gap-6 sm:items-end">

                    <div>
                      <label
                        htmlFor="bedroomCount"
                        className="mb-2 block text-sm font-semibold text-[#081225]"
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
                        className="mb-2 block text-sm font-semibold text-[#081225]"
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
                        className="mb-2 block text-sm font-semibold text-[#081225]"
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
                        className="mb-2 block text-sm font-semibold text-[#081225]"
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
                      <label className="mb-2 block text-sm font-semibold text-[#081225]">
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
                                : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
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
                      className="mb-2 block text-sm font-semibold text-[#081225]"
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
                            <label className="mb-3 block text-sm font-semibold text-[#081225]">
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
                                      : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
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
                                  className="mb-2 block text-sm font-semibold text-[#081225]"
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

                          <div>
                            <label className="mb-3 block text-sm font-semibold text-[#081225]">
                              Has any policy ever been cancelled, declined, or voided?
                            </label>

                            <div className="grid gap-3 sm:grid-cols-2">
                              {["Yes", "No"].map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      policyCancelledDeclinedVoided: option,
                                    })
                                  }
                                  className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                                    formData.policyCancelledDeclinedVoided === option
                                      ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                                      : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="mb-3 block text-sm font-semibold text-[#081225]">
                              Any criminal convictions, bankruptcy, or CCJs?
                            </label>

                              <div className="grid gap-3 sm:grid-cols-2">
                                {["Yes", "No"].map((option) => (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() =>
                                      setFormData({
                                        ...formData,
                                        criminalConvictionsOrCcjs: option,
                                      })
                                    }
                                    className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                                      formData.criminalConvictionsOrCcjs === option
                                        ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                                        : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                                    }`}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          </div>

                <div className="mt-6">
                  <label
                    htmlFor="additionalNotes"
                    className="mb-2 block text-sm font-semibold text-[#081225]"
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
                          <p className="mb-3 text-sm font-semibold text-[#081225]">
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
                        className="inline-flex h-14 items-center justify-center rounded-2xl border border-zinc-300 bg-white px-8 text-[15px] font-semibold text-[#081225] transition-colors hover:border-[#7f1d1d] hover:text-[#7f1d1d] sm:text-base"
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="inline-flex h-14 items-center justify-center rounded-2xl border border-[#081225] bg-[#081225] px-8 text-[15px] font-semibold text-white transition-colors hover:bg-[#13203a] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                      >
                        {isSubmitting ? "Submitting..." : "Submit enquiry"}
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

            {step === 1 ? (
              <aside className="rounded-[1.75rem] bg-[#f7f4ef] p-5 sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Before you begin
                </h2>
                <p className="mt-4 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Please complete the form with as much detail as possible so we can provide an accurate quote.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-[#081225] sm:mt-8">
                  What happens next
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Once you submit your enquiry, we’ll review your details and call you back to talk through your options.
                </p>

                <div className="mt-6 sm:mt-8">
                  <div className="flex items-center gap-3">
                    <img
                      src="/icons/phone.svg"
                      alt="Phone icon"
                      className="h-5 w-5 object-contain"
                    />
                    <h3 className="text-lg font-semibold text-[#081225]">
                      Prefer to speak to someone directly?
                    </h3>
                  </div>

                  <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                    Call our team on 0161 881 2139 to speak directly with one of
                    our advisors.
                  </p>
                </div>
              </aside>
            ) : (
              <aside className="rounded-[1.75rem] bg-[#f7f4ef] p-5 sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Before you submit
                </h2>
                <p className="mt-4 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  These details help us understand your property and the cover you need.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-[#081225] sm:mt-8">
                  Why we need this information
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Property type, age, flat roof areas, sum insured, and claims history can all affect the cover available. If you don’t have everything to hand, just send what you can.
                </p>

                <div className="mt-6 sm:mt-8">
                  <div className="flex items-center gap-3">
                    <img
                      src="/icons/phone.svg"
                      alt="Phone icon"
                      className="h-5 w-5 object-contain"
                    />
                    <h3 className="text-lg font-semibold text-[#081225]">
                      Prefer to speak to someone directly?
                    </h3>
                  </div>

                  <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                    Call our team on 0161 881 2139 to speak directly with one of
                    our advisors.
                  </p>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>

     <PageFooter />
    </main>
  );
}

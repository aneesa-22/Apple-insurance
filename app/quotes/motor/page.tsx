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
import TurnstileWidget from "../../components/forms/TurnstileWidget";
import { FieldErrorMessage, SubmitErrorBox } from "../../components/forms/FormFeedback";
import validateYourDetails from "../../components/lib/validateYourDetails";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function MotorTradeQuotePage() {
  const [step, setStep] = useState(1);
  const formTopRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    addressLine1: "",
    postcode: "",
    phone: "",
    email: "",
    maritalStatus: "",

    businessStructure: "",
    tradingBasis: "",
    occupation: "",
    businessName: "",
    businessAddress: "",
    businessType: "",
    otherBusinessType: "",
    runFromHome: "",
    annualTurnover: "",
    numberOfEmployees: "",
    apprentices: "",

    coverLevel: "",
    socialDomesticPleasure: "",
    commutingIncluded: "",
    businessUseIncluded: "",
    proposerVehiclesCovered: "",
    customerVehiclesCovered: "",
    maxVehicleValue: "",
    maxVehicleCount: "",
    vehicleTypes: [] as string[],
    highPerformanceVehicles: "",
    overnightLocation: "",

    youngestDriverAge: "",
    licencePointsOrConvictions: "",
    licencePointsDetails: "",
    accidentsOrClaims: "",
    claimsDetails: "",
    startDate: "",
    additionalNotes: "",
  });

  type FormField = keyof typeof formData;

  const [turnstileToken, setTurnstileToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FormField, string>>
  >({});

  useEffect(() => {
    formTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [step]);

  const isFutureOrToday = (dateValue: string) => {
    const date = new Date(`${dateValue}T00:00:00`);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return !Number.isNaN(date.getTime()) && date >= today;
  };

  const isPositiveWholeNumber = (value: string) =>
    /^\d+$/.test(value) && Number(value) >= 0;

  const isMoneyLike = (value: string) =>
    /^[\d\s,£.]+$/.test(value) && /\d/.test(value);

  const updateField = (field: FormField, value: string | string[]) => {
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

  const toggleVehicleType = (type: string) => {
    setFormData((prev) => {
      const vehicleTypes = prev.vehicleTypes.includes(type)
        ? prev.vehicleTypes.filter((item) => item !== type)
        : [...prev.vehicleTypes, type];

      return {
        ...prev,
        vehicleTypes,
      };
    });

    setFieldErrors((prev) => ({
      ...prev,
      vehicleTypes: "",
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

    if (!formData.businessStructure) {
      errors.businessStructure = "Please select your business structure.";
    }

    if (!formData.tradingBasis) {
      errors.tradingBasis = "Please select your trading basis.";
    }

    if (formData.tradingBasis === "Part-time" && !formData.occupation.trim()) {
      errors.occupation = "Please enter your occupation.";
    }

    if (!formData.businessName.trim()) {
      errors.businessName = "Please enter your business name.";
    }

    if (!formData.businessAddress.trim()) {
      errors.businessAddress = "Please enter your business address.";
    }

    if (!formData.businessType) {
      errors.businessType = "Please select your business type.";
    }

    if (
      formData.businessType === "Other" &&
      !formData.otherBusinessType.trim()
    ) {
      errors.otherBusinessType = "Please specify your business type.";
    }

    if (!formData.runFromHome) {
      errors.runFromHome = "Please tell us if the business is run from home.";
    }

    if (!formData.annualTurnover.trim()) {
      errors.annualTurnover = "Please enter your annual turnover.";
    } else if (!isMoneyLike(formData.annualTurnover)) {
      errors.annualTurnover = "Please enter a valid annual turnover.";
    }

    if (!formData.numberOfEmployees.trim()) {
      errors.numberOfEmployees = "Please enter the number of employees.";
    } else if (!isPositiveWholeNumber(formData.numberOfEmployees)) {
      errors.numberOfEmployees = "Please enter a valid number of employees.";
    }

    if (!formData.apprentices) {
      errors.apprentices = "Please tell us if you have any apprentices.";
    }

    setFieldErrors(errors);
    setSubmitError(
      Object.keys(errors).length > 0
        ? "Please complete the highlighted fields."
        : ""
    );

    return Object.keys(errors).length === 0;
  };

  const validateStepThree = () => {
    const errors: Partial<Record<FormField, string>> = {};

    if (!formData.coverLevel) {
      errors.coverLevel = "Please select your road risks cover.";
    }

    if (!formData.socialDomesticPleasure) {
      errors.socialDomesticPleasure = "Please select Yes or No.";
    }

    if (!formData.commutingIncluded) {
      errors.commutingIncluded = "Please select Yes or No.";
    }

    if (!formData.businessUseIncluded) {
      errors.businessUseIncluded = "Please select Yes or No.";
    }

    if (!formData.proposerVehiclesCovered) {
      errors.proposerVehiclesCovered = "Please select Yes or No.";
    }

    if (!formData.customerVehiclesCovered) {
      errors.customerVehiclesCovered = "Please select Yes or No.";
    }

    if (!formData.maxVehicleValue.trim()) {
      errors.maxVehicleValue = "Please enter the maximum vehicle value.";
    } else if (!isMoneyLike(formData.maxVehicleValue)) {
      errors.maxVehicleValue = "Please enter a valid maximum vehicle value.";
    }

    if (!formData.maxVehicleCount.trim()) {
      errors.maxVehicleCount = "Please enter the maximum number of vehicles.";
    } else if (!isPositiveWholeNumber(formData.maxVehicleCount)) {
      errors.maxVehicleCount = "Please enter a valid vehicle count.";
    }

    if (formData.vehicleTypes.length === 0) {
      errors.vehicleTypes = "Please select at least one vehicle type.";
    }

    if (!formData.highPerformanceVehicles.trim()) {
      errors.highPerformanceVehicles =
        "Please tell us about any high-performance vehicles.";
    }

    if (!formData.overnightLocation.trim()) {
      errors.overnightLocation =
        "Please tell us where vehicles are kept overnight.";
    }

    setFieldErrors(errors);
    setSubmitError(
      Object.keys(errors).length > 0
        ? "Please complete the highlighted fields."
        : ""
    );

    return Object.keys(errors).length === 0;
  };

  const validateStepFour = () => {
    const errors: Partial<Record<FormField, string>> = {};

    if (!formData.youngestDriverAge) {
      errors.youngestDriverAge = "Please select the age of the youngest driver.";
    }

    if (!formData.licencePointsOrConvictions) {
      errors.licencePointsOrConvictions =
        "Please tell us about any licence points or convictions.";
    }

    if (
      formData.licencePointsOrConvictions === "Yes" &&
      !formData.licencePointsDetails.trim()
    ) {
      errors.licencePointsDetails =
        "Please provide the points or conviction details.";
    }

    if (!formData.accidentsOrClaims) {
      errors.accidentsOrClaims =
        "Please tell us about any accidents or claims.";
    }

    if (formData.accidentsOrClaims === "Yes" && !formData.claimsDetails.trim()) {
      errors.claimsDetails = "Please provide the claims details.";
    }
    
    if (!formData.startDate) {
      errors.startDate = "Please enter the required start date.";
    } else if (!isFutureOrToday(formData.startDate)) {
      errors.startDate = "Please enter a valid start date.";
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

    if (!validateStepThree()) {
      setStep(3);
      return;
    }

    if (!validateStepFour()) {
      setStep(4);
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
      const response = await fetch("/api/quotes/motor", {
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
    <main
      className={`${instrumentSans.className} min-h-screen bg-white text-zinc-950`}
    >
      <QuotePageHeader activePage="motor" />
      <QuotePageHero
        eyebrow="MOTOR TRADE INSURANCE"
        heading="Tailored cover for motor traders, garages and vehicle businesses."
        supportingText="Trusted by thousands of UK motor businesses."
      />

      <div className="px-4 py-8 sm:px-8 sm:py-12 lg:px-16">
        <div ref={formTopRef} className="mx-auto w-full max-w-6xl">
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-[#7f1d1d]">
                Step {step} of 4
              </p>
              <p className="text-sm text-zinc-500">
                {step === 1 && "Your details"}
                {step === 2 && "Business details"}
                {step === 3 && "Cover and vehicles"}
                {step === 4 && "Drivers and history"}
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200">
              <div
                className={`h-full rounded-full bg-[#7f1d1d] transition-all duration-300 ${
                  step === 1
                    ? "w-1/4"
                    : step === 2
                      ? "w-2/4"
                      : step === 3
                        ? "w-3/4"
                        : "w-full"
                }`}
              />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
            {step === 1 && (
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
            )}

            {step === 2 && (
              <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#10203d] sm:text-2xl">
                  Business details
                </h2>
                <p className="mt-2 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Tell us about the type of business you run and how it operates.
                </p>

                <div className="mt-8 grid gap-5 sm:gap-6">
                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#10203d]">
                        What type of business are you?
                      </label>
                      <div className="grid gap-3">
                        {["Sole trader", "Partnership", "Limited company"].map(
                          (option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => updateField("businessStructure", option)}
                              className={`rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition-colors sm:text-base ${
                                formData.businessStructure === option
                                  ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                                  : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                              }`}
                            >
                              {option}
                            </button>
                          )
                        )}
                      </div>
                      <FieldErrorMessage message={fieldErrors.businessStructure} />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#10203d]">
                        Do you work full-time or part-time?
                      </label>
                      <div className="grid gap-3">
                        {["Full-time", "Part-time"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              updateField("tradingBasis", option);
                              if (option === "Full-time") {
                                updateField("occupation", "");
                              }
                            }}
                            className={`rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition-colors sm:text-base ${
                              formData.tradingBasis === option
                                ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                                : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <FieldErrorMessage message={fieldErrors.tradingBasis} />
                    </div>
                  </div>

                  {formData.tradingBasis === "Part-time" && (
                    <div>
                      <label
                        htmlFor="occupation"
                        className="mb-2 block text-sm font-semibold text-[#10203d]"
                      >
                       What is your main occupation?
                      </label>
                      <input
                        id="occupation"
                        type="text"
                        placeholder="Enter your occupation"
                        value={formData.occupation}
                        onChange={(e) => updateField("occupation", e.target.value)}
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldErrorMessage message={fieldErrors.occupation} />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="businessName"
                      className="mb-2 block text-sm font-semibold text-[#10203d]"
                    >
                      What is your business name?
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      placeholder="If different from your own name"
                      value={formData.businessName}
                      onChange={(e) => updateField("businessName", e.target.value)}
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                    <FieldErrorMessage message={fieldErrors.businessName} />
                  </div>

                  <div>
                    <label
                      htmlFor="businessAddress"
                      className="mb-2 block text-sm font-semibold text-[#10203d]"
                    >
                      What is your business address?
                    </label>
                    <input
                      id="businessAddress"
                      type="text"
                      placeholder="Enter your business address"
                      value={formData.businessAddress}
                      onChange={(e) => updateField("businessAddress", e.target.value)}
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                    <FieldErrorMessage message={fieldErrors.businessAddress} />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#10203d]">
                      What type of work do you do?
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        "Mechanic",
                        "Dealer",
                        "Valeter",
                        "Body repairer",
                        "MOT station",
                        "Recovery operator",
                        "Tyre/exhaust fitter",
                        "Mobile mechanic",
                        "Other",
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            updateField("businessType", option);
                            if (option !== "Other") {
                              updateField("otherBusinessType", "");
                            }
                          }}
                          className={`rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition-colors sm:text-base ${
                            formData.businessType === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.businessType} />
                  </div>

                  {formData.businessType === "Other" && (
                    <div>
                      <label
                        htmlFor="otherBusinessType"
                        className="mb-2 block text-sm font-semibold text-[#10203d]"
                      >
                        Other business type
                      </label>
                      <input
                        id="otherBusinessType"
                        type="text"
                        placeholder="Specify your business type"
                        value={formData.otherBusinessType}
                        onChange={(e) =>
                          updateField("otherBusinessType", e.target.value)
                        }
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldErrorMessage message={fieldErrors.otherBusinessType} />
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#10203d]">
                        Is your business run from your home address?
                      </label>
                      <div className="grid gap-3">
                        {["Yes", "No"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => updateField("runFromHome", option)}
                            className={`rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition-colors sm:text-base ${
                              formData.runFromHome === option
                                ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                                : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <FieldErrorMessage message={fieldErrors.runFromHome} />
                    </div>

                    <div>
                      <label
                        htmlFor="annualTurnover"
                        className="mb-2 block text-sm font-semibold text-[#10203d]"
                      >
                        What is your estimated annual turnover (£)?
                      </label>
                      <input
                        id="annualTurnover"
                        type="text"
                        placeholder="Enter annual turnover"
                        value={formData.annualTurnover}
                        onChange={(e) => updateField("annualTurnover", e.target.value)}
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldErrorMessage message={fieldErrors.annualTurnover} />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#10203d]">
                        Do you have any apprentices?
                      </label>
                      <div className="grid gap-3">
                        {["Yes", "No"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => updateField("apprentices", option)}
                            className={`rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition-colors sm:text-base ${
                              formData.apprentices === option
                                ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                                : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <FieldErrorMessage message={fieldErrors.apprentices} />
                    </div>

                    <div>
                      <label
                        htmlFor="numberOfEmployees"
                        className="mb-2 block text-sm font-semibold text-[#10203d]"
                      >
                        How many employees do you have?
                      </label>
                      <input
                        id="numberOfEmployees"
                        type="number"
                        min="0"
                        placeholder="Enter number of employees"
                        value={formData.numberOfEmployees}
                        onChange={(e) => {
                          updateField("numberOfEmployees", e.target.value);
                          if (e.target.value === "0" || e.target.value === "") {
                            updateField("apprentices", "");
                          }
                        }}
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldErrorMessage message={fieldErrors.numberOfEmployees} />
                    </div>
                  </div>
                </div>

                <div className="mt-10 space-y-4">
                  <SubmitErrorBox message={submitError} />

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
                      onClick={() => {
                        if (!validateStepTwo()) return;
                        setSubmitError("");
                        setStep(3);
                      }}
                      className={quotePrimaryButtonClass}
                    >
                  Next <span aria-hidden="true">→</span>
                </button>
                  </div>
                </div>
              </section>
            )}

            {step === 3 && (
  <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
    <h2 className="text-[21px] font-semibold tracking-tight text-[#10203d] sm:text-2xl">
      Cover and vehicles
    </h2>
    <p className="mt-2 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
      Let us know the cover you need and the types of vehicles involved.
    </p>

    <div className="mt-8 grid gap-5 sm:gap-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#10203d]">
          What level of cover do you need?
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            "Third Party Only",
            "Third Party Fire & Theft",
            "Comprehensive",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => updateField("coverLevel", option)}
              className={`rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition-colors sm:text-base ${
                formData.coverLevel === option
                  ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                  : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <FieldErrorMessage message={fieldErrors.coverLevel} />
      </div>

      <div className="grid gap-5 sm:gap-6">
  {[
    [
      "socialDomesticPleasure",
      "Will the vehicle be used for personal use (non-work)?",
    ],
    [
      "commutingIncluded",
      "Will you use the vehicle for commuting (to and from work)?",
    ],
    ["businessUseIncluded", "Will the vehicle be used for business?"],
    [
      "proposerVehiclesCovered",
      "Do you want to insure vehicles you own?",
    ],
    [
      "customerVehiclesCovered",
      "Will you be driving or working on customer vehicles?",
    ],
  ].map(([field, label]) => (
    <div key={field}>
      <label className="mb-2 block text-sm font-semibold leading-6 text-[#10203d]">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-3 sm:max-w-[340px]">
        {["Yes", "No"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => updateField(field as FormField, option)}
            className={`rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition-colors sm:text-base ${
              formData[field as keyof typeof formData] === option
                ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <FieldErrorMessage message={fieldErrors[field as FormField]} />
    </div>
  ))}
</div>



      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        <div>
          <label
  htmlFor="maxVehicleValue"
  className="mb-2 block pt-6 text-sm font-semibold text-[#10203d]"
>
  Maximum value of a vehicle (£)
</label>

          <input
            id="maxVehicleValue"
            type="text"
            placeholder="Enter maximum vehicle value"
            value={formData.maxVehicleValue}
            onChange={(e) => updateField("maxVehicleValue", e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
          />
          <FieldErrorMessage message={fieldErrors.maxVehicleValue} />
        </div>

        <div>
          <label
            htmlFor="maxVehicleCount"
            className="mb-2 block text-sm font-semibold text-[#10203d]"
          >
            Maximum number of vehicles you will have at one time
          </label>
          <input
            id="maxVehicleCount"
            type="text"
            placeholder="Enter maximum number"
            value={formData.maxVehicleCount}
            onChange={(e) => updateField("maxVehicleCount", e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
          />
          <FieldErrorMessage message={fieldErrors.maxVehicleCount} />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#10203d]">
          What types of vehicles do you need cover for?
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "Cars",
            "Vans",
            "Motorcycles",
            "Prestige vehicles",
            "Commercial vehicles",
          ].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleVehicleType(type)}
              className={`rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition-colors sm:text-base ${
                formData.vehicleTypes.includes(type)
                  ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                  : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <FieldErrorMessage message={fieldErrors.vehicleTypes} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        <div>
          <label
            htmlFor="highPerformanceVehicles"
            className="mb-2 block text-sm font-semibold text-[#10203d]"
          >
            Do you work with any high-performance vehicles?
          </label>
          <input
            id="highPerformanceVehicles"
            type="text"
            placeholder="Enter details"
            value={formData.highPerformanceVehicles}
            onChange={(e) =>
              updateField("highPerformanceVehicles", e.target.value)
            }
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
          />
          <FieldErrorMessage message={fieldErrors.highPerformanceVehicles} />
        </div>

        <div>
          <label
  htmlFor="overnightLocation"
  className="mb-2 block pt-5 text-sm font-semibold text-[#10203d]"
>
  Where are vehicles kept overnight?
</label>

          <input
            id="overnightLocation"
            type="text"
            placeholder="Enter details"
            value={formData.overnightLocation}
            onChange={(e) =>
              updateField("overnightLocation", e.target.value)
            }
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
          />
          <FieldErrorMessage message={fieldErrors.overnightLocation} />
        </div>
      </div>
    </div>

    <div className="mt-10 space-y-4">
      <SubmitErrorBox message={submitError} />

      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => setStep(2)}
          className={quoteSecondaryButtonClass}
        >
                  <span aria-hidden="true">←</span> Back
                </button>

        <button
          type="button"
          onClick={() => {
            if (!validateStepThree()) return;
            setSubmitError("");
            setStep(4);
          }}
          className={quotePrimaryButtonClass}
        >
                  Next <span aria-hidden="true">→</span>
                </button>
      </div>
    </div>
  </section>
)}


            {step === 4 && (
              <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#10203d] sm:text-2xl">
                  Drivers and history
                </h2>
                <p className="mt-2 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  A few final questions to help us understand the risk and
                  contact you properly.
                </p>

                <div className="mt-8 grid gap-5 sm:gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#10203d]">
                      What is the age of the youngest driver?
                    </label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {["21+", "25+", "30+"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("youngestDriverAge", option)}
                          className={`rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition-colors sm:text-base ${
                            formData.youngestDriverAge === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.youngestDriverAge} />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    {[
                      [
                        "licencePointsOrConvictions",
                        "Any licence points or motoring convictions?",
                      ],
                      [
                        "accidentsOrClaims",
                        "Any accidents or claims in the last 5 years?",
                      ],
                    ].map(([field, label]) => (
                      <div key={field}>
                        <label className="mb-2 block text-sm font-semibold text-[#10203d]">
                          {label}
                        </label>
                        <div className="grid gap-3">
                          {["Yes", "No"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                updateField(field as FormField, option);
                                if (
                                  field === "licencePointsOrConvictions" &&
                                  option === "No"
                                ) {
                                  updateField("licencePointsDetails", "");
                                }
                                if (
                                  field === "accidentsOrClaims" &&
                                  option === "No"
                                ) {
                                  updateField("claimsDetails", "");
                                }
                              }}
                              className={`rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition-colors sm:text-base ${
                                formData[field as keyof typeof formData] === option
                                  ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                                  : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        <FieldErrorMessage message={fieldErrors[field as FormField]} />
                      </div>
                    ))}
                  </div>

                  {formData.licencePointsOrConvictions === "Yes" && (
                    <div>
                      <label
                        htmlFor="licencePointsDetails"
                        className="mb-2 block text-sm font-semibold text-[#10203d]"
                      >
                        Points / conviction details
                      </label>
                      <textarea
                        id="licencePointsDetails"
                        rows={4}
                        placeholder="Add details here"
                        value={formData.licencePointsDetails}
                        onChange={(e) =>
                          updateField("licencePointsDetails", e.target.value)
                        }
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldErrorMessage message={fieldErrors.licencePointsDetails} />
                    </div>
                  )}

                  {formData.accidentsOrClaims === "Yes" && (
                    <div>
                      <label
                        htmlFor="claimsDetails"
                        className="mb-2 block text-sm font-semibold text-[#10203d]"
                      >
                        Claims details
                      </label>
                      <textarea
                        id="claimsDetails"
                        rows={4}
                        placeholder="Add dates, type of claim, fault/non-fault, and anything important"
                        value={formData.claimsDetails}
                        onChange={(e) => updateField("claimsDetails", e.target.value)}
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldErrorMessage message={fieldErrors.claimsDetails} />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="startDate"
                      className="mb-2 block text-sm font-semibold text-[#10203d]"
                    >
                      Required start date
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateField("startDate", e.target.value)}
className="box-border min-w-0 max-w-full w-full appearance-none rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors focus:border-[#7f1d1d] sm:text-base"
                    />
                    <FieldErrorMessage message={fieldErrors.startDate} />
                  </div>

                  <div>
                    <label
                      htmlFor="additionalNotes"
                      className="mb-2 block text-sm font-semibold text-[#10203d]"
                    >
                      Anything else we should know?{" "}
                      <span className="font-normal text-zinc-500">(Optional)</span>
                    </label>
                    <textarea
                      id="additionalNotes"
                      rows={5}
                      placeholder="Add any extra details that may help with your enquiry."
                      value={formData.additionalNotes}
                      onChange={(e) =>
                        updateField("additionalNotes", e.target.value)
                      }
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-[#10203d]">
                      Verification
                    </p>
  <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-[0_4px_14px_rgba(8,18,37,0.04)]">

                    <TurnstileWidget
                      enabled={step === 4}
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
                  <SubmitErrorBox message={submitError} />

                  {submitSuccess ? (
                    <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-5">
                      <p className="text-sm font-semibold text-green-700">
                        Your enquiry has been sent successfully.
                      </p>
                      <p className="mt-1 text-sm leading-6 text-zinc-700">
                        We&apos;ve received your enquiry and a member of our
                        team will be in touch soon.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
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

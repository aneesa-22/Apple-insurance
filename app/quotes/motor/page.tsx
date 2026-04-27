"use client";

import Link from "next/link";
import { Instrument_Sans } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import PageFooter from "../../components/site/PageFooter";
import PageHeader from "../../components/site/PageHeader";
import BackToHomeLink from "../../components/site/BackToHomeLink";
import YourDetailsStep from "../../components/forms/YourDetailsStep";
import TurnstileWidget from "../../components/forms/TurnstileWidget";
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
    insuranceCancelledDeclined: "",
    insuranceIssuesDetails: "",
    criminalConvictionsOrCcjs: "",
    disclosureDetails: "",
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

    if (!formData.insuranceCancelledDeclined) {
      errors.insuranceCancelledDeclined =
        "Please tell us about any cancelled, declined, or refused insurance.";
    }

    if (
      formData.insuranceCancelledDeclined === "Yes" &&
      !formData.insuranceIssuesDetails.trim()
    ) {
      errors.insuranceIssuesDetails =
        "Please provide the insurance history details.";
    }

    if (!formData.criminalConvictionsOrCcjs) {
      errors.criminalConvictionsOrCcjs =
        "Please tell us about any criminal convictions, bankruptcy, or CCJs.";
    }

    if (
      formData.criminalConvictionsOrCcjs === "Yes" &&
      !formData.disclosureDetails.trim()
    ) {
      errors.disclosureDetails = "Please provide the disclosure details.";
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
      <PageHeader activePage="motor" />

      <div className="px-4 py-8 sm:px-8 sm:py-12 lg:px-16">
        <div ref={formTopRef} className="mx-auto w-full max-w-6xl">
          <div className="mb-8 sm:mb-10">
            <BackToHomeLink className="mb-8" />
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#7f1d1d]">
              Motor Trade Insurance
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#081225] sm:text-4xl">
              Let&apos;s find the right motor trade insurance for you
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
              Tell us a few key details and our team will review your enquiry and
              get in touch to discuss your quote.
            </p>
          </div>

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
            )}

            {step === 2 && (
              <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Business details
                </h2>
                <p className="mt-2 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Tell us about the type of business you run and how it operates.
                </p>

                <div className="mt-8 grid gap-5 sm:gap-6">
                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#081225]">
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
                                  : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                              }`}
                            >
                              {option}
                            </button>
                          )
                        )}
                      </div>
                      <FieldError field="businessStructure" />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#081225]">
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
                                : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <FieldError field="tradingBasis" />
                    </div>
                  </div>

                  {formData.tradingBasis === "Part-time" && (
                    <div>
                      <label
                        htmlFor="occupation"
                        className="mb-2 block text-sm font-semibold text-[#081225]"
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
                      <FieldError field="occupation" />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="businessName"
                      className="mb-2 block text-sm font-semibold text-[#081225]"
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
                    <FieldError field="businessName" />
                  </div>

                  <div>
                    <label
                      htmlFor="businessAddress"
                      className="mb-2 block text-sm font-semibold text-[#081225]"
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
                    <FieldError field="businessAddress" />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#081225]">
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
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="businessType" />
                  </div>

                  {formData.businessType === "Other" && (
                    <div>
                      <label
                        htmlFor="otherBusinessType"
                        className="mb-2 block text-sm font-semibold text-[#081225]"
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
                      <FieldError field="otherBusinessType" />
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#081225]">
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
                                : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <FieldError field="runFromHome" />
                    </div>

                    <div>
                      <label
                        htmlFor="annualTurnover"
                        className="mb-2 block text-sm font-semibold text-[#081225]"
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
                      <FieldError field="annualTurnover" />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#081225]">
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
                                : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <FieldError field="apprentices" />
                    </div>

                    <div>
                      <label
                        htmlFor="numberOfEmployees"
                        className="mb-2 block text-sm font-semibold text-[#081225]"
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
                      <FieldError field="numberOfEmployees" />
                    </div>
                  </div>
                </div>

                <div className="mt-10 space-y-4">
                  <ErrorBox />

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
                      onClick={() => {
                        if (!validateStepTwo()) return;
                        setSubmitError("");
                        setStep(3);
                      }}
                      className="inline-flex h-14 items-center justify-center rounded-2xl border border-[#081225] bg-[#081225] px-8 text-[15px] font-semibold text-white transition-colors hover:bg-[#13203a] sm:text-base"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </section>
            )}

            {step === 3 && (
  <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
    <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
      Cover and vehicles
    </h2>
    <p className="mt-2 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
      Let us know the cover you need and the types of vehicles involved.
    </p>

    <div className="mt-8 grid gap-5 sm:gap-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#081225]">
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
                  : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <FieldError field="coverLevel" />
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
      <label className="mb-2 block text-sm font-semibold leading-6 text-[#081225]">
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
                : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <FieldError field={field as FormField} />
    </div>
  ))}
</div>



      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        <div>
          <label
  htmlFor="maxVehicleValue"
  className="mb-2 block pt-6 text-sm font-semibold text-[#081225]"
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
          <FieldError field="maxVehicleValue" />
        </div>

        <div>
          <label
            htmlFor="maxVehicleCount"
            className="mb-2 block text-sm font-semibold text-[#081225]"
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
          <FieldError field="maxVehicleCount" />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#081225]">
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
                  : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <FieldError field="vehicleTypes" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        <div>
          <label
            htmlFor="highPerformanceVehicles"
            className="mb-2 block text-sm font-semibold text-[#081225]"
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
          <FieldError field="highPerformanceVehicles" />
        </div>

        <div>
          <label
  htmlFor="overnightLocation"
  className="mb-2 block pt-5 text-sm font-semibold text-[#081225]"
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
          <FieldError field="overnightLocation" />
        </div>
      </div>
    </div>

    <div className="mt-10 space-y-4">
      <ErrorBox />

      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="inline-flex h-14 items-center justify-center rounded-2xl border border-zinc-300 bg-white px-8 text-[15px] font-semibold text-[#081225] transition-colors hover:border-[#7f1d1d] hover:text-[#7f1d1d] sm:text-base"
        >
          Back
        </button>

        <button
          type="button"
          onClick={() => {
            if (!validateStepThree()) return;
            setSubmitError("");
            setStep(4);
          }}
          className="inline-flex h-14 items-center justify-center rounded-2xl border border-[#081225] bg-[#081225] px-8 text-[15px] font-semibold text-white transition-colors hover:bg-[#13203a] sm:text-base"
        >
          Next
        </button>
      </div>
    </div>
  </section>
)}


            {step === 4 && (
              <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Drivers and history
                </h2>
                <p className="mt-2 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  A few final questions to help us understand the risk and
                  contact you properly.
                </p>

                <div className="mt-8 grid gap-5 sm:gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#081225]">
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
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="youngestDriverAge" />
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
                        <label className="mb-2 block text-sm font-semibold text-[#081225]">
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
                                  : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        <FieldError field={field as FormField} />
                      </div>
                    ))}
                  </div>

                  {formData.licencePointsOrConvictions === "Yes" && (
                    <div>
                      <label
                        htmlFor="licencePointsDetails"
                        className="mb-2 block text-sm font-semibold text-[#081225]"
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
                      <FieldError field="licencePointsDetails" />
                    </div>
                  )}

                  {formData.accidentsOrClaims === "Yes" && (
                    <div>
                      <label
                        htmlFor="claimsDetails"
                        className="mb-2 block text-sm font-semibold text-[#081225]"
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
                      <FieldError field="claimsDetails" />
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    {[
                      [
                        "insuranceCancelledDeclined",
                        "Any insurance cancelled, declined, or refused?",
                      ],
                      [
                        "criminalConvictionsOrCcjs",
                        "Any criminal convictions, bankruptcy, or CCJs?",
                      ],
                    ].map(([field, label]) => (
                      <div key={field}>
                        <label className="mb-2 block text-sm font-semibold text-[#081225]">
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
                                  field === "insuranceCancelledDeclined" &&
                                  option === "No"
                                ) {
                                  updateField("insuranceIssuesDetails", "");
                                }
                                if (
                                  field === "criminalConvictionsOrCcjs" &&
                                  option === "No"
                                ) {
                                  updateField("disclosureDetails", "");
                                }
                              }}
                              className={`rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition-colors sm:text-base ${
                                formData[field as keyof typeof formData] === option
                                  ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                                  : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        <FieldError field={field as FormField} />
                      </div>
                    ))}
                  </div>

                  {formData.insuranceCancelledDeclined === "Yes" && (
                    <div>
                      <label
                        htmlFor="insuranceIssuesDetails"
                        className="mb-2 block text-sm font-semibold text-[#081225]"
                      >
                        Insurance history details
                      </label>
                      <textarea
                        id="insuranceIssuesDetails"
                        rows={4}
                        placeholder="Add details here"
                        value={formData.insuranceIssuesDetails}
                        onChange={(e) =>
                          updateField("insuranceIssuesDetails", e.target.value)
                        }
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldError field="insuranceIssuesDetails" />
                    </div>
                  )}

                  {formData.criminalConvictionsOrCcjs === "Yes" && (
                    <div>
                      <label
                        htmlFor="disclosureDetails"
                        className="mb-2 block text-sm font-semibold text-[#081225]"
                      >
                        Disclosure details
                      </label>
                      <textarea
                        id="disclosureDetails"
                        rows={4}
                        placeholder="Add details here"
                        value={formData.disclosureDetails}
                        onChange={(e) =>
                          updateField("disclosureDetails", e.target.value)
                        }
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldError field="disclosureDetails" />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="startDate"
                      className="mb-2 block text-sm font-semibold text-[#081225]"
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
                    <FieldError field="startDate" />
                  </div>

                  <div>
                    <label
                      htmlFor="additionalNotes"
                      className="mb-2 block text-sm font-semibold text-[#081225]"
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
                    <p className="mb-3 text-sm font-semibold text-[#081225]">
                      Verification
                    </p>

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

                <div className="mt-10 space-y-4">
                  <ErrorBox />

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

            {step === 1 && (
              <aside className="rounded-[1.75rem] bg-[#f7f4ef] p-5 sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Before you begin
                </h2>
                <p className="mt-4 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Please complete the form with as much detail as possible so we
                  can provide an accurate quote.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-[#081225] sm:mt-8">
                  What happens next
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Once you submit your enquiry, our team will review the details
                  and contact you to discuss the right cover for your business.
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

            {step === 2 && (
              <aside className="rounded-[1.75rem] bg-[#f7f4ef] p-5 sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Business details
                </h2>
                <p className="mt-4 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  These questions help us understand the type and scale of the
                  motor trade work you carry out.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-[#081225] sm:mt-8">
                  Keep it simple
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  If you do not know exact figures right now, give your best
                  estimate and our team can go through the detail with you
                  later.
                </p>

                <div className="mt-6 sm:mt-8">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-[#081225]">
                      Not sure about everything?
                    </h3>
                  </div>

                  <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                    That&apos;s fine. Send what you can and we&apos;ll go through
                    the rest with you when we call.
                  </p>
                </div>
              </aside>
            )}

            {step === 3 && (
              <aside className="rounded-[1.75rem] bg-[#f7f4ef] p-5 sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Cover and vehicles
                </h2>
                <p className="mt-4 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  This section helps us understand what you want covered and the
                  types of vehicles involved in the business.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-[#081225] sm:mt-8">
                  Why we ask this
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  The level of road risks cover, number of vehicles, and vehicle
                  types all affect how your enquiry is assessed.
                </p>

                <div className="mt-6 sm:mt-8">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-[#081225]">
                      Not sure about everything?
                    </h3>
                  </div>

                  <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                    That&apos;s fine. Send what you can and we&apos;ll go through
                    the rest with you when we call.
                  </p>
                </div>
              </aside>
            )}

            {step === 4 && (
              <aside className="rounded-[1.75rem] bg-[#f7f4ef] p-5 sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Drivers and history
                </h2>
                <p className="mt-4 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  These questions help us understand previous claims,
                  disclosures, and when you need cover to start.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-[#081225] sm:mt-8">
                  Be as accurate as you can
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  If anything needs more detail, our team will go through it
                  with you on the callback.
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
                    Call our team on 0161 881 2139 for quick, friendly advice.
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

"use client";

import Link from "next/link";
import { Instrument_Sans } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import PageFooter from "../../components/site/PageFooter";
import PageHeader from "../../components/site/PageHeader";
import BackToHomeLink from "../../components/site/BackToHomeLink";
import YourDetailsStep from "../../components/forms/YourDetailsStep";
import validateYourDetails from "../../components/lib/validateYourDetails";
import TurnstileWidget from "../../components/forms/TurnstileWidget";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function LandlordQuotePage() {
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
    hadClaimsLastFiveYears: "",
    claimCount: "",
    propertyAddress: "",
    propertyType: "",
    bedroomCount: "",
    yearBuilt: "",
    standardConstruction: "",
    floodingHistory: "",
    subsidenceHistory: "",
    structuralMovementHistory: "",
    tenantType: "",
    tenantCount: "",
    writtenTenancyAgreement: "",
    longTermLet: "",
    isHmo: "",
    businessUse: "",
    emptyMoreThanThirtyDays: "",
    buildingsCover: "",
    contentsCover: "",
    lossOfRentCover: "",
    propertyOwnersLiability: "",
    accidentalDamage: "",
    hasMortgage: "",
    lenderName: "",
    buyToLetMortgage: "",
    smokeAlarms: "",
    gasSafetyCertificate: "",
    electricalSafetyCertificate: "",
    previousInsurerName: "",
    renewalDate: "",
    policyCancelledDeclinedVoided: "",
    criminalConvictionsOrCcjs: "",
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

  const isPositiveWholeNumber = (value: string) =>
    /^\d+$/.test(value) && Number(value) >= 0;

  const isFutureOrToday = (dateValue: string) => {
    const date = new Date(`${dateValue}T00:00:00`);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return !Number.isNaN(date.getTime()) && date >= today;
  };

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

    if (!formData.hadClaimsLastFiveYears) {
      errors.hadClaimsLastFiveYears =
        "Please tell us if there have been any property claims in the last 5 years.";
    }

    if (formData.hadClaimsLastFiveYears === "Yes") {
      const claimCount = Number(formData.claimCount);

      if (!formData.claimCount.trim()) {
        errors.claimCount = "Please enter how many claims there have been.";
      } else if (
        !Number.isInteger(claimCount) ||
        claimCount < 1 ||
        claimCount > 20
      ) {
        errors.claimCount = "Please enter a valid number of claims.";
      }
    }

    if (!formData.propertyAddress.trim()) {
      errors.propertyAddress = "Please enter the property address.";
    }

    if (!formData.propertyType) {
      errors.propertyType = "Please select the property type.";
    }

    if (!formData.bedroomCount.trim()) {
      errors.bedroomCount = "Please enter the number of bedrooms.";
    } else if (!isPositiveWholeNumber(formData.bedroomCount)) {
      errors.bedroomCount = "Please enter a valid number of bedrooms.";
    }

    if (!formData.yearBuilt.trim()) {
      errors.yearBuilt = "Please enter the year built.";
    } else if (!/^\d{4}$/.test(formData.yearBuilt.trim())) {
      errors.yearBuilt = "Please enter a valid 4-digit year.";
    }

    if (!formData.standardConstruction) {
      errors.standardConstruction =
        "Please tell us if the property is standard construction.";
    }

    if (!formData.floodingHistory) {
      errors.floodingHistory =
        "Please tell us if the property has ever flooded.";
    }

    if (!formData.subsidenceHistory) {
      errors.subsidenceHistory =
        "Please tell us if the property has had subsidence.";
    }

    if (!formData.structuralMovementHistory) {
      errors.structuralMovementHistory =
        "Please tell us if there has been structural movement or issues.";
    }

    if (!formData.tenantType) {
      errors.tenantType = "Please select who lives in the property.";
    }

    if (!formData.tenantCount.trim()) {
      errors.tenantCount = "Please enter the number of tenants.";
    } else if (!isPositiveWholeNumber(formData.tenantCount)) {
      errors.tenantCount = "Please enter a valid number of tenants.";
    }

    if (!formData.writtenTenancyAgreement) {
      errors.writtenTenancyAgreement =
        "Please tell us if you have a tenancy agreement.";
    }

    if (!formData.longTermLet) {
      errors.longTermLet = "Please tell us if this is a long-term let.";
    }

    if (!formData.isHmo) {
      errors.isHmo = "Please tell us if the property is an HMO.";
    }

    if (!formData.businessUse) {
      errors.businessUse =
        "Please tell us if the property is used for business purposes.";
    }

    if (!formData.emptyMoreThanThirtyDays) {
      errors.emptyMoreThanThirtyDays =
        "Please tell us if the property will be empty for more than 30 days.";
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

    if (!formData.buildingsCover) {
      errors.buildingsCover = "Please tell us if you need buildings cover.";
    }

    if (!formData.contentsCover) {
      errors.contentsCover = "Please tell us if you need contents cover.";
    }

    if (!formData.lossOfRentCover) {
      errors.lossOfRentCover = "Please tell us if you need loss of rent cover.";
    }

    if (!formData.propertyOwnersLiability) {
      errors.propertyOwnersLiability =
        "Please select the property owners’ liability level.";
    }

    if (!formData.accidentalDamage) {
      errors.accidentalDamage =
        "Please tell us if you need accidental damage cover.";
    }

    if (!formData.hasMortgage) {
      errors.hasMortgage =
        "Please tell us if there is a mortgage on the property.";
    }

    if (formData.hasMortgage === "Yes" && !formData.lenderName.trim()) {
      errors.lenderName = "Please enter the lender name.";
    }

    if (formData.hasMortgage === "Yes" && !formData.buyToLetMortgage) {
      errors.buyToLetMortgage =
        "Please tell us if it is a buy-to-let mortgage.";
    }

    if (!formData.smokeAlarms) {
      errors.smokeAlarms = "Please tell us if smoke alarms are installed.";
    }

    if (!formData.gasSafetyCertificate) {
      errors.gasSafetyCertificate =
        "Please tell us about the gas safety certificate.";
    }

    if (!formData.electricalSafetyCertificate) {
      errors.electricalSafetyCertificate =
        "Please tell us about the electrical safety certificate.";
    }

    if (!formData.previousInsurerName.trim()) {
      errors.previousInsurerName = "Please enter the previous insurer name.";
    }

    if (!formData.renewalDate) {
      errors.renewalDate = "Please enter the renewal date.";
    } else if (!isFutureOrToday(formData.renewalDate)) {
      errors.renewalDate = "Please enter a valid renewal date.";
    }

    if (!formData.policyCancelledDeclinedVoided) {
      errors.policyCancelledDeclinedVoided =
        "Please tell us if a policy has ever been cancelled, declined or voided.";
    }

    if (!formData.criminalConvictionsOrCcjs) {
      errors.criminalConvictionsOrCcjs =
        "Please tell us if there are any criminal convictions, bankruptcy, or CCJs.";
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

    if (!turnstileToken) {
      setSubmitError("Please complete the captcha verification.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/quotes/landlord", {
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
      <PageHeader activePage="landlord" />

      <div className="px-4 py-8 sm:px-8 sm:py-12 lg:px-16">
        <div ref={formTopRef} className="mx-auto w-full max-w-6xl">
          <div className="mb-8 sm:mb-10">
            <BackToHomeLink className="mb-8" />

            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#7f1d1d]">
              Landlord Insurance
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#081225] sm:text-4xl">
              Let&apos;s find the right landlord insurance for you
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
              Tell us a few details and we’ll review your enquiry and call you
              back to talk through your options.
            </p>
          </div>

          <div className="mb-8 sm:mb-10">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-[#7f1d1d]">
                Step {step} of 3
              </p>
              <p className="text-sm text-zinc-500">
                {step === 1
                  ? "Your details"
                  : step === 2
                    ? "Property details"
                    : "Cover and insurance"}
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200">
              <div
                className={`h-full rounded-full bg-[#7f1d1d] transition-all duration-300 ${
                  step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"
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
            ) : step === 2 ? (
              <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Property details
                </h2>
                <p className="mt-2 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Tell us about the property, tenants, and how the property is
                  used.
                </p>

                <div className="mt-8 grid gap-5 sm:gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#081225]">
                      Any property claims in the last 5 years?
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            updateField("hadClaimsLastFiveYears", option);
                            if (option === "No") {
                              updateField("claimCount", "");
                            }
                          }}
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.hadClaimsLastFiveYears === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="hadClaimsLastFiveYears" />

                    {formData.hadClaimsLastFiveYears === "Yes" && (
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
                            updateField("claimCount", e.target.value)
                          }
                          className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                        />
                        <FieldError field="claimCount" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="propertyAddress"
                      className="mb-2 block text-sm font-semibold text-[#081225]"
                    >
                      Property address
                    </label>
                    <textarea
                      id="propertyAddress"
                      rows={4}
                      placeholder="Enter property address"
                      value={formData.propertyAddress}
                      onChange={(e) =>
                        updateField("propertyAddress", e.target.value)
                      }
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                    <FieldError field="propertyAddress" />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#081225]">
                      Property type
                    </label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {["House", "Flat", "Maisonette"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("propertyType", option)}
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
                    <FieldError field="propertyType" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label
                        htmlFor="bedroomCount"
                        className="mb-2 block text-sm font-semibold text-[#081225]"
                      >
                        Bedrooms
                      </label>
                      <input
                        id="bedroomCount"
                        type="number"
                        min="0"
                        placeholder="Enter number of bedrooms"
                        value={formData.bedroomCount}
                        onChange={(e) =>
                          updateField("bedroomCount", e.target.value)
                        }
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldError field="bedroomCount" />
                    </div>

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
                        onChange={(e) => updateField("yearBuilt", e.target.value)}
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldError field="yearBuilt" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#081225]">
                      Is the property standard construction?
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            updateField("standardConstruction", option)
                          }
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.standardConstruction === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="standardConstruction" />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Has the property ever flooded?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("floodingHistory", option)}
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.floodingHistory === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="floodingHistory" />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Has the property had subsidence?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            updateField("subsidenceHistory", option)
                          }
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.subsidenceHistory === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="subsidenceHistory" />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Any structural movement or issues?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            updateField("structuralMovementHistory", option)
                          }
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.structuralMovementHistory === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="structuralMovementHistory" />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#081225]">
                      Who lives in the property?
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        "Working tenants",
                        "Family tenants",
                        "Students",
                        "DSS / Universal Credit",
                        "Company let",
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("tenantType", option)}
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.tenantType === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="tenantType" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label
                        htmlFor="tenantCount"
                        className="mb-2 block text-sm font-semibold text-[#081225]"
                      >
                        Number of tenants
                      </label>
                      <input
                        id="tenantCount"
                        type="number"
                        min="0"
                        placeholder="Enter number of tenants"
                        value={formData.tenantCount}
                        onChange={(e) => updateField("tenantCount", e.target.value)}
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldError field="tenantCount" />
                    </div>

                    <div>
                      <p className="mb-2 block text-sm font-semibold text-[#081225]">
                        Do you have a tenancy agreement (AST)?
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {["Yes", "No"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              updateField("writtenTenancyAgreement", option)
                            }
                            className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                              formData.writtenTenancyAgreement === option
                                ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                                : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <FieldError field="writtenTenancyAgreement" />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Is this a long-term let?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("longTermLet", option)}
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.longTermLet === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="longTermLet" />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Is the property an HMO? (House in multiple occupation)
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("isHmo", option)}
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.isHmo === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="isHmo" />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Is the property used for business purposes?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("businessUse", option)}
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.businessUse === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="businessUse" />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Will the property be empty for more than 30 days?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            updateField("emptyMoreThanThirtyDays", option)
                          }
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.emptyMoreThanThirtyDays === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="emptyMoreThanThirtyDays" />
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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
              </section>
            ) : (
              <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Cover and insurance
                </h2>
                <p className="mt-2 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Tell us about the cover you need and your current insurance.
                </p>

                <div className="mt-8 grid gap-5 sm:gap-6">
                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Buildings cover
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("buildingsCover", option)}
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.buildingsCover === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="buildingsCover" />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Contents cover (if the property is furnished)
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("contentsCover", option)}
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.contentsCover === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="contentsCover" />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Loss of rent cover
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("lossOfRentCover", option)}
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.lossOfRentCover === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="lossOfRentCover" />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Property owners’ liability
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {["£2m", "£5m", "£10m"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            updateField("propertyOwnersLiability", option)
                          }
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.propertyOwnersLiability === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="propertyOwnersLiability" />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Accidental damage
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("accidentalDamage", option)}
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.accidentalDamage === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="accidentalDamage" />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Is there a mortgage on the property?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            updateField("hasMortgage", option);
                            if (option === "No") {
                              updateField("lenderName", "");
                              updateField("buyToLetMortgage", "");
                            }
                          }}
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.hasMortgage === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="hasMortgage" />
                  </div>

                  {formData.hasMortgage === "Yes" && (
                    <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                      <div>
                        <label
                          htmlFor="lenderName"
                          className="mb-2 block text-sm font-semibold text-[#081225]"
                        >
                          Lender name
                        </label>
                        <input
                          id="lenderName"
                          type="text"
                          placeholder="Enter lender name"
                          value={formData.lenderName}
                          onChange={(e) => updateField("lenderName", e.target.value)}
                          className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                        />
                        <FieldError field="lenderName" />
                      </div>

                      <div>
                        <p className="mb-2 block text-sm font-semibold text-[#081225]">
                          Buy-to-let mortgage?
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {["Yes", "No"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                updateField("buyToLetMortgage", option)
                              }
                              className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                                formData.buyToLetMortgage === option
                                  ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                                  : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        <FieldError field="buyToLetMortgage" />
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Are there smoke alarms installed?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("smokeAlarms", option)}
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.smokeAlarms === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="smokeAlarms" />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Gas safety certificate (if applicable)
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {["Yes", "No", "N/A"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            updateField("gasSafetyCertificate", option)
                          }
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.gasSafetyCertificate === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="gasSafetyCertificate" />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Electrical safety certificate (EICR)
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            updateField("electricalSafetyCertificate", option)
                          }
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.electricalSafetyCertificate === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="electricalSafetyCertificate" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label
                        htmlFor="previousInsurerName"
                        className="mb-2 block text-sm font-semibold text-[#081225]"
                      >
                        Previous insurer
                      </label>
                      <input
                        id="previousInsurerName"
                        type="text"
                        placeholder="Enter previous insurer (if known)"
                        value={formData.previousInsurerName}
                        onChange={(e) =>
                          updateField("previousInsurerName", e.target.value)
                        }
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldError field="previousInsurerName" />
                    </div>

                    <div>
                      <label
                        htmlFor="renewalDate"
                        className="mb-2 block text-sm font-semibold text-[#081225]"
                      >
                        Renewal date
                      </label>
                      <input
                        id="renewalDate"
                        type="date"
                        value={formData.renewalDate}
                        onChange={(e) => updateField("renewalDate", e.target.value)}
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldError field="renewalDate" />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Has a policy ever been cancelled, declined or voided?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            updateField("policyCancelledDeclinedVoided", option)
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
                    <FieldError field="policyCancelledDeclinedVoided" />
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
                            updateField("criminalConvictionsOrCcjs", option)
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
                    <FieldError field="criminalConvictionsOrCcjs" />
                  </div>

                  <div>
                    <label
                      htmlFor="additionalNotes"
                      className="mb-2 block text-sm font-semibold text-[#081225]"
                    >
                      Anything else we should know?{" "}
                      <span className="font-normal text-zinc-500">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      id="additionalNotes"
                      rows={5}
                      placeholder="Add any extra details that may help with your enquiry."
                      value={formData.additionalNotes}
                      onChange={(e) =>
                        updateField("additionalNotes", e.target.value)
                      }
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-[#081225]">
                      Verification
                    </p>

                    <TurnstileWidget
                      enabled={step === 3}
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
                        We&apos;ve also sent a confirmation email to you, and a
                        member of our team will be in touch soon.
                      </p>
                    </div>
                  ) : (
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
                  Please complete the form with as much detail as possible so we
                  can provide an accurate quote.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-[#081225] sm:mt-8">
                  What happens next
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Once you submit your enquiry, our team will review your
                  details and contact you to talk through your options.
                </p>

                <div className="mt-6 sm:mt-8">
                  <div className="flex items-center gap-3">
                    <img
                      src="/icons/phone.svg"
                      alt="Phone icon"
                      className="h-5 w-5 object-contain"
                    />
                    <h3 className="text-lg font-semibold text-[#081225]">
                      Prefer to speak to us?
                    </h3>
                  </div>

                  <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                    Call our team on 0161 881 2139 to speak directly with one of
                    our advisors.
                  </p>
                </div>
              </aside>
            ) : step === 2 ? (
              <aside className="rounded-[1.75rem] bg-[#f7f4ef] p-5 sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Property details
                </h2>
                <p className="mt-4 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  These details help us understand the property and tenancy
                  before we call you.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-[#081225] sm:mt-8">
                  Why we need this information
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Things like property type, construction, occupancy and history
                  can affect the cover available and how we review your enquiry.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-[#081225] sm:mt-8">
                  Not sure about everything?
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  That’s fine. Send what you can and we’ll talk through the rest
                  when we call you.
                </p>
              </aside>
            ) : (
              <aside className="rounded-[1.75rem] bg-[#f7f4ef] p-5 sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Cover and insurance
                </h2>
                <p className="mt-4 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  These details help us understand the cover you need and your
                  current insurance.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-[#081225] sm:mt-8">
                  Why we ask for this
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Cover choices, safety checks, and insurance history can all
                  affect the options available.
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

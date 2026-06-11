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
import { FieldErrorMessage, SubmitErrorBox } from "../../components/forms/FormFeedback";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const landlordInsuranceOptions = [
  {
    title: "Let property",
    description: "Get a quote for a let property policy.",
    href: "https://www.sabacus.co.uk/product/new/dca/2343/dcachecksum/cmegPUpN9TNcyGrs24gUaZ-0TuZaQMbPu4VYs76a_mg/product/1",
  },
  {
    title: "Unoccupied property",
    description: "Get a quote for an unoccupied property policy.",
    href: "https://www.sabacus.co.uk/product/new/dca/2343/dcachecksum/cmegPUpN9TNcyGrs24gUaZ-0TuZaQMbPu4VYs76a_mg/product/14",
  },
  {
    title: "Commercial property",
    description: "Get a quote for a commercial property policy.",
    href: "https://www.sabacus.co.uk/product/new/dca/2343/dcachecksum/cmegPUpN9TNcyGrs24gUaZ-0TuZaQMbPu4VYs76a_mg/product/3",
  },
];

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

  const showExternalLandlordOptions = true;

  if (showExternalLandlordOptions) {
    return (
      <main
        className={`${instrumentSans.className} min-h-screen bg-white text-zinc-950`}
      >
        <QuotePageHeader activePage="landlord" />
        <QuotePageHero
          eyebrow="LANDLORD INSURANCE"
          heading="What kind of insurance are you looking for?"
          supportingText="Choose the property cover you need and we’ll take you to the right quote journey."
        />

        <section className="bg-[#f7f4ef] px-4 py-8 sm:px-8 sm:py-12 lg:px-16">
          <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
            <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
              <h2 className="text-[24px] font-bold tracking-tight text-[#10203d] sm:text-3xl">
                What kind of insurance are you looking for?
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                Select one of the options below and you’ll be taken to the
                correct external quote page.
              </p>

              <div className="mt-8 grid gap-4">
                {landlordInsuranceOptions.map((option) => (
                  <a
                    key={option.title}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_8px_24px_rgba(8,18,37,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#9f1d1d]/50 hover:shadow-[0_14px_34px_rgba(8,18,37,0.1)] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span>
                      <span className="block text-[17px] font-bold text-[#10203d]">
                        {option.title}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-zinc-600">
                        {option.description}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#10203d] text-white transition-colors group-hover:bg-[#9f1d1d]"
                    >
                      →
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <QuoteReassurancePanel />
          </div>
        </section>

        <PageFooter />
      </main>
    );
  }

  return (
    <main
      className={`${instrumentSans.className} min-h-screen bg-white text-zinc-950`}
    >
      <QuotePageHeader activePage="landlord" />
      <QuotePageHero
        eyebrow="LANDLORD INSURANCE"
        heading="Tailored cover for landlords, rental homes and property portfolios."
        supportingText="Trusted by thousands of UK property owners."
      />

      <div className="px-4 py-8 sm:px-8 sm:py-12 lg:px-16">
        <div ref={formTopRef} className="mx-auto w-full max-w-6xl">
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
            ) : step === 2 ? (
              <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#10203d] sm:text-2xl">
                  Property details
                </h2>
                <p className="mt-2 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Tell us about the property, tenants, and how the property is
                  used.
                </p>

                <div className="mt-8 grid gap-5 sm:gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.hadClaimsLastFiveYears} />

                    {formData.hadClaimsLastFiveYears === "Yes" && (
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
                            updateField("claimCount", e.target.value)
                          }
                          className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                        />
                        <FieldErrorMessage message={fieldErrors.claimCount} />
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="propertyAddress"
                      className="mb-2 block text-sm font-semibold text-[#10203d]"
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
                    <FieldErrorMessage message={fieldErrors.propertyAddress} />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.propertyType} />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label
                        htmlFor="bedroomCount"
                        className="mb-2 block text-sm font-semibold text-[#10203d]"
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
                      <FieldErrorMessage message={fieldErrors.bedroomCount} />
                    </div>

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
                        onChange={(e) => updateField("yearBuilt", e.target.value)}
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldErrorMessage message={fieldErrors.yearBuilt} />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.standardConstruction} />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.floodingHistory} />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.subsidenceHistory} />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.structuralMovementHistory} />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.tenantType} />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label
                        htmlFor="tenantCount"
                        className="mb-2 block text-sm font-semibold text-[#10203d]"
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
                      <FieldErrorMessage message={fieldErrors.tenantCount} />
                    </div>

                    <div>
                      <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                                : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <FieldErrorMessage message={fieldErrors.writtenTenancyAgreement} />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.longTermLet} />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.isHmo} />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.businessUse} />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.emptyMoreThanThirtyDays} />
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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
              </section>
            ) : (
              <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
                <h2 className="text-[21px] font-semibold tracking-tight text-[#10203d] sm:text-2xl">
                  Cover and insurance
                </h2>
                <p className="mt-2 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Tell us about the cover you need and your current insurance.
                </p>

                <div className="mt-8 grid gap-5 sm:gap-6">
                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.buildingsCover} />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.contentsCover} />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.lossOfRentCover} />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.propertyOwnersLiability} />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.accidentalDamage} />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.hasMortgage} />
                  </div>

                  {formData.hasMortgage === "Yes" && (
                    <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                      <div>
                        <label
                          htmlFor="lenderName"
                          className="mb-2 block text-sm font-semibold text-[#10203d]"
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
                        <FieldErrorMessage message={fieldErrors.lenderName} />
                      </div>

                      <div>
                        <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                                  : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        <FieldErrorMessage message={fieldErrors.buyToLetMortgage} />
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.smokeAlarms} />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.gasSafetyCertificate} />
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-semibold text-[#10203d]">
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
                              : "border-zinc-200 bg-white text-[#10203d] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldErrorMessage message={fieldErrors.electricalSafetyCertificate} />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label
                        htmlFor="previousInsurerName"
                        className="mb-2 block text-sm font-semibold text-[#10203d]"
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
                      <FieldErrorMessage message={fieldErrors.previousInsurerName} />
                    </div>

                    <div>
                      <label
                        htmlFor="renewalDate"
                        className="mb-2 block text-sm font-semibold text-[#10203d]"
                      >
                        Renewal date
                      </label>
                      <input
                        id="renewalDate"
                        type="date"
                        value={formData.renewalDate}
                        onChange={(e) => updateField("renewalDate", e.target.value)}
className="box-border min-w-0 max-w-full w-full appearance-none rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldErrorMessage message={fieldErrors.renewalDate} />
                    </div>
                  </div>

                 
                  <div>
                    <label
                      htmlFor="additionalNotes"
                      className="mb-2 block text-sm font-semibold text-[#10203d]"
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
                    <p className="mb-3 text-sm font-semibold text-[#10203d]">
                      Verification
                    </p>
  <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-[0_4px_14px_rgba(8,18,37,0.04)]">

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
</div>
                <div className="mt-10 space-y-4">
                  <SubmitErrorBox message={submitError} />

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

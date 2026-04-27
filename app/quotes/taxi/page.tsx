"use client";

// Next/link is used for the Privacy Notice link later in the page
import Link from "next/link";

// Google fonts used for page styling
import { Libre_Baskerville, Instrument_Sans } from "next/font/google";

// React hooks for refs and component state
import { useRef, useState } from "react";

// Shared site components
import PageFooter from "../../components/site/PageFooter";
import PageHeader from "../../components/site/PageHeader";
import BackToHomeLink from "../../components/site/BackToHomeLink";
import YourDetailsStep from "../../components/forms/YourDetailsStep";
import TurnstileWidget from "../../components/forms/TurnstileWidget";
import validateYourDetails from "../../components/lib/validateYourDetails";

// Main font for page content
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function TaxiQuotePage() {
  // Tracks which step of the form the user is currently on
  const [step, setStep] = useState(1);

  // Lets us scroll back to the top of the form area if needed
  const formTopRef = useRef<HTMLDivElement | null>(null);

  // All form values live in one state object
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
    drivingLicenceType: "",
    licenceNumber: "",
    licenceAuthority: "",
    vehicleRegistration: "",
    noClaimsBonus: "",
    hadClaims: "",
    claimCount: "",
    criminalConvictionsOrCcjs: "",
    renewalDate: "",
    policyCancelledDeclinedVoided: "",
    additionalNotes: "",
  });

  // Creates a reusable type from the formData keys
  // This helps keep updateField / fieldErrors type-safe
  type FormField = keyof typeof formData;

  // Submission state for button disabling / feedback messages
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Stores the Cloudflare Turnstile token once verification succeeds
  const [turnstileToken, setTurnstileToken] = useState("");

  // Stores per-field validation messages
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FormField, string>>
  >({});

  // Generic field updater used throughout the page
  // It updates the field, clears that field's error, and clears the general submit error
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

  // Small helper component for showing a validation message under one field
  const FieldError = ({ field }: { field: FormField }) => {
    if (!fieldErrors[field]) return null;

    return (
      <p className="mt-2 text-sm font-medium text-[#7f1d1d]">
        {fieldErrors[field]}
      </p>
    );
  };

  // General form-level error box shown above submit actions
  const ErrorBox = () => {
    if (!submitError) return null;

    return (
      <div className="rounded-2xl border border-[#7f1d1d]/20 bg-[#fdf1f1] px-5 py-4">
        <p className="text-sm font-semibold text-[#7f1d1d]">{submitError}</p>
      </div>
    );
  };

  // Step 1 validation uses the shared validator because
  // the "Your details" step is now standard across forms
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

  // Step 2 remains taxi-specific, so its validation stays local
  const validateStepTwo = () => {
    const errors: Partial<Record<FormField, string>> = {};

    if (formData.licenceNumber.trim().length < 8) {
      errors.licenceNumber = "Please enter a valid driving licence number.";
    }

    if (!formData.licenceAuthority.trim()) {
      errors.licenceAuthority = "Please enter your licensing authority.";
    }

    if (!/^[A-Z0-9 ]{2,10}$/i.test(formData.vehicleRegistration)) {
      errors.vehicleRegistration = "Please enter a valid vehicle registration.";
    }

    if (!formData.noClaimsBonus) {
      errors.noClaimsBonus = "Please select your no claims bonus.";
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

    if (!formData.renewalDate) {
      errors.renewalDate = "Please enter your current policy renewal date.";
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

  // Final submission handler
  // It validates step 1 and step 2 first, checks captcha, then posts to the API
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
      const response = await fetch("/api/quotes/taxi", {
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
      <PageHeader activePage="taxi" />
      <div className="px-4 py-8 sm:px-8 sm:py-12 lg:px-16">
        <div ref={formTopRef} className="mx-auto w-full max-w-6xl">
          <div className="mb-8 sm:mb-10">
            <BackToHomeLink className="mb-8" />
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#7f1d1d]">
              Taxi Insurance
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#081225] sm:text-4xl">
              Let&apos;s find the right taxi insurance for you
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
              Tell us a few details and we’ll review your enquiry and call you
              back to talk through your options.
            </p>
          </div>

          <div className="mb-8 sm:mb-10">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-[#7f1d1d]">
                Step {step} of 2
              </p>
              <p className="text-sm text-zinc-500">
                {step === 1 ? "Your details" : "Your cover & vehicle details"}
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



{/* Step 1 shared details section */}


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
                  Your vehicle & cover details
                </h2>
                <p className="mt-2 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  Add any details you have about your vehicle and cover.
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  It only takes a few details to get started. We’ll guide you through the rest.
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Your information is kept secure and only used to provide your quote.
                </p>

                <div className="mt-8 grid gap-5 sm:gap-6">
                  <div>
                    <label
                      htmlFor="licenceNumber"
                      className="mb-2 block text-sm font-semibold text-[#081225]"
                    >
                      Driving Licence number
                    </label>
                    <input
                      id="licenceNumber"
                      type="text"
                      placeholder="Enter your licence number"
                      value={formData.licenceNumber}
                      onChange={(e) => updateField("licenceNumber", e.target.value)}
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                    <FieldError field="licenceNumber" />
                  </div>

                  <div>
                    <label
                      htmlFor="licenceAuthority"
                      className="mb-2 block text-sm font-semibold text-[#081225]"
                    >
                      Licensing authority
                    </label>
                    <input
                      id="licenceAuthority"
                      type="text"
                      placeholder="Enter your licensing authority"
                      value={formData.licenceAuthority}
                      onChange={(e) =>
                        updateField("licenceAuthority", e.target.value)
                      }
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                    <FieldError field="licenceAuthority" />
                  </div>

                  <div>
                    <label
                      htmlFor="vehicleRegistration"
                      className="mb-2 block text-sm font-semibold text-[#081225]"
                    >
                      Vehicle Registration (VRN)
                    </label>
                    <input
                      id="vehicleRegistration"
                      type="text"
                      placeholder="Enter your vehicle registration"
                      value={formData.vehicleRegistration}
                      onChange={(e) =>
                        updateField(
                          "vehicleRegistration",
                          e.target.value.toUpperCase()
                        )
                      }
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] uppercase text-zinc-900 outline-none transition-colors placeholder:normal-case placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                    <FieldError field="vehicleRegistration" />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#081225]">
                      No claims bonus{" "}
                      <span className="font-normal text-zinc-500">(years)</span>
                    </label>

                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {["0", "1", "2", "3", "4", "5+"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("noClaimsBonus", option)}
                          className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                            formData.noClaimsBonus === option
                              ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                              : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <FieldError field="noClaimsBonus" />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#081225]">
                      Any claims in the last 5 years?
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            updateField("hadClaims", option);

                            if (option === "No") {
                              updateField("claimCount", "");
                            }
                          }}
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
                    <FieldError field="hadClaims" />
                  </div>

                  {formData.hadClaims === "Yes" && (
                    <div>
                      <label
                        htmlFor="claimCount"
                        className="mb-2 block text-sm font-semibold text-[#081225]"
                      >
                        How many claims
                      </label>
                      <input
                        id="claimCount"
                        type="number"
                        min="1"
                        placeholder="Enter number of claims"
                        value={formData.claimCount}
                        onChange={(e) => updateField("claimCount", e.target.value)}
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                      />
                      <FieldError field="claimCount" />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="renewalDate"
                      className="mb-2 block text-sm font-semibold text-[#081225]"
                    >
                      Current policy renewal date
                    </label>
                    <input
                      id="renewalDate"
                      type="date"
                      value={formData.renewalDate}
                      onChange={(e) => updateField("renewalDate", e.target.value)}
className="box-border min-w-0 max-w-full w-full appearance-none rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors focus:border-[#7f1d1d] sm:text-base"
                    />
                    <FieldError field="renewalDate" />
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
                    <p className="mb-2 block text-sm font-semibold text-[#081225]">
                      Any criminal convictions, bankruptcy, or CCJs?
                    </p>

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
                      Additional details{" "}
                      <span className="font-normal text-zinc-500">(Optional)</span>
                    </label>
                    <textarea
                      id="additionalNotes"
                      rows={5}
                      placeholder="Add any extra details that may help with your enquiry."
                      value={formData.additionalNotes}
                      onChange={(e) => updateField("additionalNotes", e.target.value)}
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
                    />
                    <FieldError field="additionalNotes" />
                  </div>
                </div>

                <div className="mt-10 space-y-4">
  <ErrorBox />

  <div className="mt-6">
    <p className="mb-3 text-sm font-semibold text-[#081225]">
      Verification
    </p>

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
                  Please complete the form with as much detail as possible so we
                  can provide an accurate quote.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-[#081225] sm:mt-8">
                  What happens next
                </h3>
                <div className="mt-3 space-y-4 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  <p>
                    Once you submit your enquiry, our team will review your
                    details and contact you to talk through your options.
                  </p>
                </div>

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
                  These details help us understand your vehicle and insurance needs
                  so we can provide an accurate quote.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-[#081225] sm:mt-8">
                  What happens next
                </h3>
                <div className="mt-3 space-y-4 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
                  <p>
                    Once you submit your enquiry, we’ll review your details and
                    call you back to talk through your options.
                  </p>
                </div>

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

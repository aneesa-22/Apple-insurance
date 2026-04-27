"use client";

import { ReactNode } from "react";

export type YourDetailsFormData = {
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  maritalStatus: string;
  addressLine1: string;
  postcode: string;
};

type YourDetailsField = keyof YourDetailsFormData;

type YourDetailsStepProps = {
  formData: YourDetailsFormData;
  updateField: (field: YourDetailsField, value: string) => void;
  fieldErrors?: Partial<Record<YourDetailsField, string>>;
  children?: ReactNode;
};

export default function YourDetailsStep({
  formData,
  updateField,
  fieldErrors = {},
  children,
}: YourDetailsStepProps) {
  const FieldError = ({ field }: { field: YourDetailsField }) => {
    if (!fieldErrors[field]) return null;

    return (
      <p className="mt-2 text-sm font-medium text-[#7f1d1d]">
        {fieldErrors[field]}
      </p>
    );
  };

  return (
    <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
      <div className="space-y-2">
        <h2 className="text-[21px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
          Your details
        </h2>
        <p className="text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
          Tell us who you are and how we can reach you.
        </p>
        <p className="text-sm leading-6 text-zinc-500">
          Your details are kept secure and only used to provide your quote.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:gap-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#081225]">
            Title
          </label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {["Mr", "Mrs", "Miss", "Ms", "Mx"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => updateField("title", option)}
                className={`rounded-2xl border px-4 py-3 text-[15px] font-medium transition-colors sm:text-base ${
                  formData.title === option
                    ? "border-[#7f1d1d] bg-[#f8e8e8] text-[#7f1d1d]"
                    : "border-zinc-200 bg-white text-[#081225] hover:border-[#7f1d1d]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <FieldError field="title" />
        </div>

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
              onChange={(e) => updateField("firstName", e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
            />
            <FieldError field="firstName" />
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
              onChange={(e) => updateField("lastName", e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
            />
            <FieldError field="lastName" />
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold text-[#081225]"
          >
            Phone number (we’ll call you back)
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
          />
          <FieldError field="phone" />
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
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
          />
          <FieldError field="email" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <div>
            <label
              htmlFor="dateOfBirth"
              className="mb-2 block text-sm font-semibold text-[#081225]"
            >
              Date of birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateField("dateOfBirth", e.target.value)}
className="box-border min-w-0 max-w-full w-full appearance-none rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors focus:border-[#7f1d1d] sm:text-base"
            />
            <FieldError field="dateOfBirth" />
          </div>

          <div>
            <label
              htmlFor="maritalStatus"
              className="mb-2 block text-sm font-semibold text-[#081225]"
            >
              Marital status
            </label>

            <div className="relative">
              <select
                id="maritalStatus"
                value={formData.maritalStatus}
                onChange={(e) => updateField("maritalStatus", e.target.value)}
                className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 pr-12 text-[15px] text-zinc-900 outline-none transition-colors focus:border-[#7f1d1d] sm:text-base"
              >
                <option value="">Select your marital status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Civil Partnership">Civil Partnership</option>
                <option value="Separated">Separated</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
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
            <FieldError field="maritalStatus" />
          </div>
        </div>

        <div>
          <label
            htmlFor="addressLine1"
            className="mb-2 block text-sm font-semibold text-[#081225]"
          >
            First line of Address
          </label>
          <input
            id="addressLine1"
            type="text"
            placeholder="House number and street name (e.g. 123 High Street)"
            value={formData.addressLine1}
            onChange={(e) => updateField("addressLine1", e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
          />
          <FieldError field="addressLine1" />
        </div>

        <div>
          <label
            htmlFor="postcode"
            className="mb-2 block text-sm font-semibold text-[#081225]"
          >
            Postcode
          </label>
          <input
            id="postcode"
            type="text"
            placeholder="Enter your postcode"
            value={formData.postcode}
            onChange={(e) => updateField("postcode", e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-[15px] uppercase text-zinc-900 outline-none transition-colors placeholder:normal-case placeholder:text-zinc-400 focus:border-[#7f1d1d] sm:text-base"
          />
          <FieldError field="postcode" />
        </div>
      </div>

      {children ? <div className="mt-10 space-y-4">{children}</div> : null}
    </section>
  );
}

"use client";

type FieldErrorMessageProps = {
  message?: string;
};

export function FieldErrorMessage({ message }: FieldErrorMessageProps) {
  if (!message) return null;

  return <p className="mt-2 text-sm font-medium text-[#7f1d1d]">{message}</p>;
}

type SubmitErrorBoxProps = {
  message?: string;
};

export function SubmitErrorBox({ message }: SubmitErrorBoxProps) {
  if (!message) return null;

  return (
    <div className="rounded-2xl border border-[#7f1d1d]/20 bg-[#fdf1f1] px-5 py-4">
      <p className="text-sm font-semibold text-[#7f1d1d]">{message}</p>
    </div>
  );
}

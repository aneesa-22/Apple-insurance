"use client";

type QuotePageHeroProps = {
  eyebrow: string;
  heading: string;
  supportingText: string;
};

export default function QuotePageHero({
  eyebrow,
  heading,
  supportingText,
}: QuotePageHeroProps) {
  return (
    <section className="border-b border-zinc-200 bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#9f1d1d]">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#10203d] sm:text-4xl lg:text-5xl">
          {heading}
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-8 text-zinc-600 sm:text-[19px]">
          {supportingText}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-[14px] font-semibold text-[#10203d]">
          <div className="flex items-center gap-1 text-[#9f1d1d]" aria-label="Star rating">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>
          <span className="h-5 w-px bg-zinc-300" />
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#10203d]/20 text-[12px] text-[#9f1d1d]">
              ✓
            </span>
            <span>FCA regulated</span>
          </div>
        </div>
      </div>
    </section>
  );
}

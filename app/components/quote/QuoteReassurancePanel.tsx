"use client";

const reassuranceRows = [
  {
    title: "FCA regulated",
    copy: "Clear, regulated support from a trusted insurance broker.",
    icon: "/icons/shield-check.svg",
  },
  {
    title: "Secure & confidential",
    copy: "Your information is handled carefully and kept private.",
    icon: "/icons/lock.svg",
  },
  {
    title: "UK based advisors",
    copy: "Speak to people who understand UK insurance needs.",
    icon: "/icons/headset.svg",
  },
  {
    title: "Fast callback times",
    copy: "We aim to respond quickly once your enquiry is received.",
    icon: "/icons/clock.svg",
  },
];

export default function QuoteReassurancePanel() {
  return (
    <aside className="rounded-[1.75rem] border border-zinc-200 bg-[#f7f4ef] p-5 shadow-[0_14px_40px_rgba(8,18,37,0.08)] sm:rounded-3xl sm:p-8 lg:sticky lg:top-6">
      <h2 className="max-w-[13ch] text-[22px] font-bold leading-tight tracking-tight text-[#10203d] sm:text-2xl">
        Why choose Apple Insurance?
      </h2>
      <p className="mt-4 text-[15px] leading-7 text-[#10203d]/80 sm:text-[16px]">
        We make insurance simple and help customers get the right cover quickly
        with clear, friendly support.
      </p>

      <div className="mt-7 divide-y divide-zinc-300/80">
        {reassuranceRows.map((row) => (
          <div key={row.title} className="flex gap-4 py-5 first:pt-0 last:pb-0">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#9f1d1d]/35 bg-white">
              <img
                src={row.icon}
                alt=""
                aria-hidden="true"
                className="h-5 w-5 object-contain"
              />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#10203d]">{row.title}</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-600">{row.copy}</p>
            </div>
          </div>
        ))}
      </div>

      <a
        href="tel:01618812139"
        className="mt-7 flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white/75 p-4 shadow-[0_8px_24px_rgba(8,18,37,0.06)] transition-colors hover:border-[#9f1d1d]/40"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#9f1d1d] text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <span>
          <span className="block text-[15px] font-semibold text-[#10203d]">
            Prefer to speak to someone?
          </span>
          <span className="mt-1 block text-sm text-zinc-600">
            Call our team on{" "}
            <span className="font-bold text-[#9f1d1d]">0161 881 2139</span>
          </span>
        </span>
      </a>
    </aside>
  );
}

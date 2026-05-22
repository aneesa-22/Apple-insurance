"use client";

import Link from "next/link";
import { Libre_Baskerville } from "next/font/google";
import { useState } from "react";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

type ActivePage = "taxi" | "home" | "landlord" | "motor" | "about" | "contact";

type QuotePageHeaderProps = {
  activePage: ActivePage;
};

const navItems = [
  { id: "taxi", label: "Taxi", href: "/quotes/taxi" },
  { id: "home", label: "Home", href: "/quotes/home" },
  { id: "landlord", label: "Landlord", href: "/quotes/landlord" },
  { id: "motor", label: "Motor", href: "/quotes/motor" },
  { id: "about", label: "About Us", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
] as const;

export default function QuotePageHeader({ activePage }: QuotePageHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[radial-gradient(circle_at_top_left,_rgba(127,29,29,0.22),_transparent_24%),linear-gradient(135deg,#0b1730_0%,#122344_55%,#10203d_100%)] text-white shadow-[0_1px_0_rgba(255,255,255,0.08)]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:px-12 lg:py-7">
        <Link href="/" className="relative flex min-h-[82px] w-[180px] shrink-0 items-center">
          <img
            src="/icons/logo.png"
            alt=""
            aria-hidden="true"
            className="absolute -left-5 top-4 h-40 w-40 -translate-y-1/2 object-contain opacity-85"
          />
          <div className="relative z-10 pl-12">
            <p
              className={`${libreBaskerville.className} text-[23px] font-bold leading-[0.92] tracking-tight text-white`}
            >
              Apple
            </p>
            <p
              className={`${libreBaskerville.className} -mt-0.5 text-[23px] font-bold leading-[0.92] tracking-tight text-white`}
            >
              Insurance
            </p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#b82727]">
              Services
            </p>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-9 text-[15px] font-semibold text-zinc-200 lg:flex">
          {navItems.map((item) => {
            const isActive = item.id === activePage;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group relative py-3 transition-colors duration-200 ${
                  isActive ? "text-white" : "hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute left-0 top-full h-[3px] rounded-full bg-[#b82727] transition-all duration-200 ${
                    isActive ? "w-7" : "w-0 group-hover:w-7"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center justify-end lg:flex">
          <a
            href="tel:01618812139"
            className="flex items-center gap-2 whitespace-nowrap text-[14px] font-semibold text-white transition-colors hover:text-[#f4d0d0]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-[#f4d0d0]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span>Call us: 0161 881 2139</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-2xl text-white transition-colors hover:border-[#b82727] hover:text-[#f4d0d0] lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? "×" : "☰"}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 px-5 pb-5 sm:px-8 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col rounded-3xl border border-white/10 bg-white/5 p-5 text-[16px] font-semibold text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`border-b border-white/10 py-3 transition-colors last:border-b-0 hover:text-white ${
                  item.id === activePage ? "text-white" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:01618812139"
              className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white"
            >
              Call us: 0161 881 2139
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

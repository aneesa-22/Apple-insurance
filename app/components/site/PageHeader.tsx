"use client";

import Link from "next/link";
import { Libre_Baskerville } from "next/font/google";
import { useState } from "react";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

type ActivePage =
  | "taxi"
  | "home"
  | "landlord"
  | "motor"
  | "about"
  | "contact"


type PageHeaderProps = {
  activePage?: ActivePage;
};


const navItems = [
  { id: "taxi", label: "Taxi", href: "/quotes/taxi" },
  { id: "home", label: "Home", href: "/quotes/home" },
  { id: "landlord", label: "Landlord", href: "/quotes/landlord" },
  { id: "motor", label: "Motor", href: "/quotes/motor" },
  { id: "about", label: "About Us", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },

] as const;

export default function  Header({ activePage }: PageHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[radial-gradient(circle_at_top_left,_rgba(127,29,29,0.22),_transparent_24%),linear-gradient(135deg,#0b1730_0%,#122344_55%,#10203d_100%)]">
<div className="flex w-full max-w-6xl flex-col gap-5 px-4 pt-10 pb-6 sm:px-8 sm:pb-8 sm:pt-20">          <div className="flex items-start">
          <Link href="/" className="relative shrink-0">
    <img
      src="/icons/logo.png"
      alt=""
      aria-hidden="true"
      className="absolute -left-4 -top-19 h-40 w-40 object-contain opacity-80 sm:-left-10 sm:-top-30 sm:h-65 sm:w-65"
    />

    <div className="relative z-10 pl-10 sm:pl-16">
  <p
    className={`${libreBaskerville.className} text-[18px] font-bold leading-[0.95] tracking-tight text-white sm:text-[36px]`}
  >
    Apple
  </p>

  <p
    className={`${libreBaskerville.className} -mt-[2px] text-[18px] font-bold leading-[0.95] tracking-tight text-white sm:-mt-1 sm:text-[36px]`}
  >
    Insurance
  </p>

  <p className="-mt-[1px] text-[8px] font-bold uppercase tracking-[0.08em] text-[#9f1d1d] sm:mt-1 sm:text-[15px] sm:tracking-[0.12em]">
    Services
  </p>
</div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-2xl text-white transition-colors hover:border-[#7f1d1d] hover:text-[#7f1d1d] active:border-[#7f1d1d] active:text-[#7f1d1d] lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? "×" : "☰"}
          </button>

          <nav className="hidden items-center gap-8 pt-2 text-[17px] text-zinc-300 lg:ml-auto lg:flex lg:text-[19px]">
            {navItems.map((item, index) => {
              const isActive = item.id === activePage;
              const showDivider = index === 3;

              return (
                <>
                  {showDivider && (
                    <span key={`divider-${item.id}`} className="h-5 w-px shrink-0 bg-white/20" />
                  )}
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`group relative whitespace-nowrap font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`absolute left-1/2 top-full mt-2 h-[3px] -translate-x-1/2 rounded-full bg-[#7f1d1d] transition-all duration-200 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                </>
              );
            })}
            <span className="h-5 w-px shrink-0 bg-white/20" />
            <a
              href="tel:01618812139"
              className="flex items-center gap-2 whitespace-nowrap font-medium text-[#9f1d1d] transition-colors duration-200 hover:text-[#c0392b]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
                <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
              </svg>
              0161 881 2139
            </a>
          </nav>
        </div>

        {mobileMenuOpen && (
          <nav className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-5 text-[17px] text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:hidden">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="border-b border-white/10 py-3 font-medium transition-colors hover:text-[#7f1d1d] active:text-[#7f1d1d]"
            >
              Homepage
            </Link>

            {navItems.map((item, index) => {
              const isActive = item.id === activePage;
              const isLast = index === navItems.length - 1;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-3 font-medium transition-colors hover:text-[#7f1d1d] active:text-[#7f1d1d] ${
                    !isLast ? "border-b border-white/10" : ""
                  } ${isActive ? "text-white" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}

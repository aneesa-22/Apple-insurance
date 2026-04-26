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
    <header className="bg-[radial-gradient(circle_at_top_left,_rgba(127,29,29,0.22),_transparent_24%),linear-gradient(135deg,#07101f_0%,#0c1730_55%,#081225_100%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-8 sm:pb-8 sm:pt-20">
        <div className="flex items-start justify-between gap-4 sm:gap-6">
          <Link href="/" className="relative shrink-0">
            <img
              src="/icons/logo.png"
              alt=""
              aria-hidden="true"
              className="absolute -left-4 -top-2 h-16 w-16 object-contain opacity-80 sm:-left-9 sm:-top-28 sm:h-60 sm:w-60"
            />

            <div className="relative z-10 pl-10 sm:pl-16">
              <p
                className={`${libreBaskerville.className} text-[24px] font-bold leading-[0.95] tracking-tight text-white sm:text-[36px]`}
              >
                Apple
              </p>
              <p
                className={`${libreBaskerville.className} -mt-1 text-[24px] font-bold leading-[0.95] tracking-tight text-white sm:text-[36px]`}
              >
                Insurance
              </p>
              <p className="mt-2 pl-[2px] text-[11px] font-medium uppercase tracking-[0.26em] text-[#7f1d1d] sm:mt-2 sm:text-[13px]">
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

          <nav className="hidden flex-1 items-center justify-end gap-10 pt-2 text-[17px] text-zinc-300 lg:flex lg:text-[19px]">
            {navItems.map((item) => {
              const isActive = item.id === activePage;

              return (
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
              );
            })}
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

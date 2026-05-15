"use client";

import Link from "next/link";
import { Libre_Baskerville, Instrument_Sans } from "next/font/google";
import { useState } from "react";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`${instrumentSans.className} min-h-screen bg-white text-zinc-950`}>
<section className="bg-[radial-gradient(circle_at_top_left,_rgba(127,29,29,0.28),_transparent_22%),radial-gradient(circle_at_85%_20%,_rgba(59,130,246,0.18),_transparent_26%),linear-gradient(135deg,#0b1730_0%,#122344_52%,#10203d_100%)] px-5 py-12 sm:min-h-[78vh] sm:px-8 sm:py-20 lg:min-h-[68vh] lg:px-16 lg:py-24">
        <div className="flex w-full max-w-5xl flex-col gap-8 sm:gap-10">
          <header className="mb-10 flex flex-col gap-5 sm:mb-16 sm:gap-6 lg:mb-24">
            <div className="flex items-start justify-between gap-4 sm:gap-6">
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

              <nav className="hidden flex-1 items-center justify-end gap-10 pt-2 text-[17px] text-zinc-300 lg:flex lg:text-[19px]">

                <Link
                  href="/quotes/taxi"
                  className="group relative whitespace-nowrap font-medium text-zinc-300 transition-colors duration-200 hover:text-white"
                >
                  <span>Taxi</span>
                  <span className="absolute left-1/2 top-full mt-2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#7f1d1d] transition-all duration-200 group-hover:w-full" />
                </Link>

                <Link
                  href="/quotes/home"
                  className="group relative whitespace-nowrap font-medium text-zinc-300 transition-colors duration-200 hover:text-white"
                >
                  <span>Home</span>
                  <span className="absolute left-1/2 top-full mt-2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#7f1d1d] transition-all duration-200 group-hover:w-full" />
                </Link>

                <Link
                  href="/quotes/landlord"
                  className="group relative whitespace-nowrap font-medium text-zinc-300 transition-colors duration-200 hover:text-white"
                >
                  <span>Landlord</span>
                  <span className="absolute left-1/2 top-full mt-2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#7f1d1d] transition-all duration-200 group-hover:w-full" />
                </Link>

                <Link
                  href="/quotes/motor"
                  className="group relative whitespace-nowrap font-medium text-zinc-300 transition-colors duration-200 hover:text-white"
                >
                  <span>Motor</span>
                  <span className="absolute left-1/2 top-full mt-2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#7f1d1d] transition-all duration-200 group-hover:w-full" />
                </Link>

                <Link
                  href="/about"
                  className="group relative whitespace-nowrap font-medium text-zinc-300 transition-colors duration-200 hover:text-white"
                >
                  <span>About Us</span>
                  <span className="absolute left-1/2 top-full mt-2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#7f1d1d] transition-all duration-200 group-hover:w-full" />
                </Link>

                <Link
                  href="/contact"
                  className="group relative whitespace-nowrap font-medium text-zinc-300 transition-colors duration-200 hover:text-white"
                >
                  <span>Contact Us</span>
                  <span className="absolute left-1/2 top-full mt-2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#7f1d1d] transition-all duration-200 group-hover:w-full" />
                </Link>
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

                <Link
                  href="/quotes/taxi"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-white/10 py-3 font-medium transition-colors hover:text-[#7f1d1d] active:text-[#7f1d1d]"
                >
                  Taxi
                </Link>

                <Link
                  href="/quotes/home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-white/10 py-3 font-medium transition-colors hover:text-[#7f1d1d] active:text-[#7f1d1d]"
                >
                  Home 
                </Link>

                <Link
                  href="/quotes/landlord"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-white/10 py-3 font-medium transition-colors hover:text-[#7f1d1d] active:text-[#7f1d1d]"
                >
                 Landlord
                </Link>

                <Link
                  href="/quotes/motor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-white/10 py-3 font-medium transition-colors hover:text-[#7f1d1d] active:text-[#7f1d1d]"
                >
                  Motor 
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-white/10 py-3 font-medium transition-colors hover:text-[#7f1d1d] active:text-[#7f1d1d]"
                >
                  About Us
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 font-medium transition-colors hover:text-[#7f1d1d] active:text-[#7f1d1d]"
                >
                  Contact
                </Link>
              </nav>
            )}
          </header>

          <div className="flex flex-col items-start gap-6 text-left sm:gap-8">
            <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-5xl">
              Cover you can trust.
              <br />
              People you can{" "}
              <span style={{ textDecoration: "underline", textDecorationColor: "#9f1d1d", textDecorationThickness: "3px", textUnderlineOffset: "6px" }}>rely</span>
              {" "}on.
            </h1>

            <div className="max-w-2xl space-y-3">
                <p className="text-lg leading-8 text-zinc-300 sm:hidden">
                  Clear, straightforward insurance support
                </p>
                <p className="hidden text-xl leading-8 text-zinc-300 sm:block sm:text-[22px] sm:leading-9 lg:text-[24px]">
                                  Clear, straightforward insurance support
       </p>

                <p className="text-[16px] leading-7 text-zinc-300 sm:hidden">
                  Request a free quote and we'll call you back.
                </p>
                <p className="hidden text-[17px] leading-8 text-zinc-300 sm:block sm:text-[18px] lg:text-[20px] lg:leading-9">
                We take the time to get it right. Send your details for a free quote and we’ll call you back to discuss your options.                </p>
              </div>



            <div className="mt-1 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <Link
                className="inline-flex h-14 w-full min-w-0 items-center justify-center gap-3 rounded-2xl border border-[#7f1d1d] bg-white px-7 text-[17px] font-bold text-[#10203d] shadow-[0_1px_0_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-[#7f1d1d] hover:text-white active:bg-[#7f1d1d] active:text-white sm:min-w-[230px]"
                href="/#find-cover"
                onClick={(e) => {
                  const isHomePage = window.location.pathname === "/";
                  const el = document.getElementById("find-cover");

                  if (isHomePage && el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    window.history.replaceState(null, "", "#find-cover");
                  }
                }}
              >
                Get a quote
                <span className="text-[#9f1d1d]">→</span>
              </Link>

              <a
                className="inline-flex h-14 w-full min-w-0 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-7 text-[17px] font-bold text-white transition-all duration-200 hover:border-[#7f1d1d] hover:bg-white/10 hover:text-[#7f1d1d] active:border-[#7f1d1d] active:bg-white/10 active:text-[#7f1d1d] sm:min-w-[230px]"
                href="tel:01618812139"
              >
                Speak to our team
                <span className="text-[#9f1d1d]">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

                  <section
  id="find-cover"
  className="bg-[#f7f4ef] px-4 py-16 sm:-mt-8 sm:px-8 sm:py-24 lg:px-16 lg:py-32"
>
  <div className="mx-auto w-full max-w-6xl">
    <div className="h-0" />

    <div className="flex min-h-[58vh] flex-col justify-center sm:min-h-[62vh] lg:min-h-[66vh]">
      <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
        <h2 className="text-3xl font-semibold tracking-tight text-[#10203d] sm:text-4xl">
          Find the cover you need
        </h2>

        <p className="mt-3 text-[17px] leading-8 text-zinc-600 sm:text-[19px] sm:leading-8 lg:text-[21px] lg:leading-9">
          Choose the type of cover you are looking for and we will guide your
          enquiry to the right place.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        <div className="flex min-h-[190px] flex-col items-center rounded-[1.75rem] border border-zinc-200 bg-white p-4 text-center shadow-[0_10px_30px_rgba(8,18,37,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7f1d1d] hover:shadow-[0_18px_44px_rgba(8,18,37,0.14)] sm:min-h-[280px] sm:p-7 lg:min-h-[312px] lg:p-8">
          <div className="mt-2 flex items-center justify-center sm:mt-4">
           <img
              src="/icons/taxi-thin.svg"
              alt="Taxi icon"
              className="h-14 w-14 object-contain sm:h-20 sm:w-20 lg:h-24 lg:w-24"
            />
          </div>

          <h3 className="mt-5 text-[14px] font-semibold leading-tight tracking-tight text-[#10203d] sm:mt-6 sm:text-[18px] lg:text-[19px]">
            Taxi Insurance
          </h3>

          <div className="flex-1" />

          <Link
            className="mt-4 inline-flex h-9 items-center justify-center rounded-2xl border border-[#7f1d1d] px-3 text-[12px] font-semibold text-[#7f1d1d] transition-colors hover:bg-[#7f1d1d] hover:text-white sm:mt-7 sm:h-11 sm:px-5 sm:text-sm"
            href="/quotes/taxi"
          >
            Get a quote
          </Link>
        </div>

        <div className="flex min-h-[190px] flex-col items-center rounded-[1.75rem] border border-zinc-200 bg-white p-4 text-center shadow-[0_10px_30px_rgba(8,18,37,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7f1d1d] hover:shadow-[0_18px_44px_rgba(8,18,37,0.14)] sm:min-h-[280px] sm:p-7 lg:min-h-[312px] lg:p-8">
          <div className="mt-2 flex items-center justify-center sm:mt-4">
            <img
              src="/icons/home.svg"
              alt="Home icon"
              className="h-14 w-14 object-contain sm:h-20 sm:w-20 lg:h-24 lg:w-24"
            />
          </div>

          <h3 className="mt-5 text-[14px] font-semibold leading-tight tracking-tight text-[#10203d] sm:mt-6 sm:text-[18px] lg:text-[19px]">
            Home Insurance
          </h3>

          <div className="flex-1" />

          <Link
            className="mt-4 inline-flex h-9 items-center justify-center rounded-2xl border border-[#7f1d1d] px-3 text-[12px] font-semibold text-[#7f1d1d] transition-colors hover:bg-[#7f1d1d] hover:text-white sm:mt-7 sm:h-11 sm:px-5 sm:text-sm"
            href="/quotes/home"
          >
            Get a quote
          </Link>
        </div>

                <div className="flex min-h-[190px] flex-col items-center rounded-[1.75rem] border border-zinc-200 bg-white p-4 text-center shadow-[0_10px_30px_rgba(8,18,37,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7f1d1d] hover:shadow-[0_18px_44px_rgba(8,18,37,0.14)] sm:min-h-[280px] sm:p-7 lg:min-h-[312px] lg:p-8">
                  <div className="mt-2 flex items-center justify-center sm:mt-4">
                    <img
                      src="/icons/building.svg"
                      alt="Building icon"
                      className="h-14 w-14 object-contain sm:h-20 sm:w-20 lg:h-24 lg:w-24"
                    />
                  </div>

                  <h3 className="mt-5 text-[14px] font-semibold leading-tight tracking-tight text-[#10203d] sm:mt-6 sm:text-[18px] lg:text-[19px]">
                    Landlord Insurance
                  </h3>

                  <div className="flex-1" />

                  <Link
                    className="mt-4 inline-flex h-9 items-center justify-center rounded-2xl border border-[#7f1d1d] px-3 text-[12px] font-semibold text-[#7f1d1d] transition-colors hover:bg-[#7f1d1d] hover:text-white sm:mt-7 sm:h-11 sm:px-5 sm:text-sm"
                    href="/quotes/landlord"
                  >
                    Get a quote
                  </Link>
                </div>

                <div className="flex min-h-[190px] flex-col items-center rounded-[1.75rem] border border-zinc-200 bg-white p-4 text-center shadow-[0_10px_30px_rgba(8,18,37,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7f1d1d] hover:shadow-[0_18px_44px_rgba(8,18,37,0.14)] sm:min-h-[280px] sm:p-7 lg:min-h-[312px] lg:p-8">
                  <div className="mt-2 flex items-center justify-center sm:mt-4">
                    <img
                      src="/icons/engine.svg"
                      alt="Engine icon"
                      className="h-14 w-14 object-contain sm:h-20 sm:w-20 lg:h-24 lg:w-24"
                    />
                  </div>

                  <h3 className="mt-5 text-[14px] font-semibold leading-tight tracking-tight text-[#10203d] sm:mt-6 sm:text-[18px] lg:text-[19px]">
                    Motor Insurance
                  </h3>

                  <div className="flex-1" />

                  <Link
                    className="mt-4 inline-flex h-9 items-center justify-center rounded-2xl border border-[#7f1d1d] px-3 text-[12px] font-semibold text-[#7f1d1d] transition-colors hover:bg-[#7f1d1d] hover:text-white sm:mt-7 sm:h-11 sm:px-5 sm:text-sm"
                    href="/quotes/motor"
                  >
                    Get a quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>


      <section className="bg-[radial-gradient(circle_at_top_left,_rgba(127,29,29,0.28),_transparent_22%),radial-gradient(circle_at_85%_20%,_rgba(59,130,246,0.18),_transparent_26%),linear-gradient(135deg,#0b1730_0%,#122344_52%,#10203d_100%)] px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Our insurance partners
            </h2>
            <p className="mt-3 text-[17px] leading-8 text-zinc-300 lg:text-[20px] lg:leading-9">
             We work with trusted UK insurers to find cover that’s right for you.
            </p>

          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
              <div className="flex h-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-4">
                <div className="flex h-16 w-full max-w-[140px] items-center justify-center rounded-2xl bg-white px-4">
                  <img
                    src="/partners/inshur.png"
                    alt="Inshur logo"
                    className="max-h-16 w-auto object-contain"
                  />
                </div>
              </div>

              <div className="flex h-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-4">
                <div className="flex h-16 w-full max-w-[140px] items-center justify-center rounded-2xl bg-white px-4">
                  <img
                    src="/partners/axa.png"
                    alt="AXA logo"
                    className="max-h-14 w-auto object-contain"
                  />
                </div>
              </div>

              <div className="flex h-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-4">
                <div className="flex h-16 w-full max-w-[140px] items-center justify-center rounded-2xl bg-white px-4">
                  <img
                    src="/partners/sabre.png"
                    alt="Sabre logo"
                    className="max-h-10 w-auto object-contain"
                  />
                </div>
              </div>

              <div className="flex h-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-4">
                <div className="flex h-16 w-full max-w-[140px] items-center justify-center rounded-2xl bg-white px-4">
                  <img
                    src="/partners/collingwood.png"
                    alt="Collingwood logo"
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              </div>

              <div className="hidden h-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-4 lg:flex">
                <div className="flex h-16 w-full max-w-[140px] items-center justify-center rounded-2xl bg-white px-4">
                  <img
                    src="/partners/haven.png"
                    alt="Haven logo"
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:hidden">
              <div className="flex h-24 w-full max-w-[calc(50%-0.5rem)] min-w-[140px] items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-4">
                <div className="flex h-16 w-full max-w-[140px] items-center justify-center rounded-2xl bg-white px-4">
                  <img
                    src="/partners/haven.png"
                    alt="Haven logo"
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    <section className="bg-white px-5 py-20 sm:px-8 sm:py-32 lg:px-20">
  <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
    <div className="max-w-xl">
      
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#10203d] sm:text-4xl">
        How it works
      </h2>
      <p className="mt-4 text-[16px] leading-7 text-zinc-600 sm:text-[19px] sm:leading-8 lg:text-[21px] lg:leading-9">
          Clear answers to common questions<br/> about how we handle your quote and what happens next.
        </p>

    </div>

    <div className="space-y-3 sm:space-y-4">
      <div className="overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-[#f8f5ef] shadow-[0_10px_30px_rgba(8,18,37,0.04)] sm:rounded-[1.75rem]">
        <button
          type="button"
          onClick={() =>
            setOpenItem((prev) => (prev === "info-time" ? null : "info-time"))
          }
          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-7 sm:py-6"
        >
          <span className="text-[17px] font-semibold tracking-tight text-[#10203d] sm:text-[20px]">
            How long does it take to get a quote?
          </span>
          <span className="shrink-0 text-[26px] leading-none text-[#7f1d1d]">
            {openItem === "info-time" ? "−" : "+"}
          </span>
        </button>

        {openItem === "info-time" && (
          <div className="border-t border-zinc-200 px-4 py-4 text-[15px] leading-7 text-zinc-600 sm:px-7 sm:py-6 sm:text-[17px] sm:leading-8 lg:text-[18px] lg:leading-9">
            Once we have your details, we’ll review your enquiry and aim to get back to you within <span className="font-semibold text-[#7f1d1d]">24 hours</span>.

              It only takes a few details to get started, and we’ll guide you through the rest.

              No obligation, just clear advice to help you decide.
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-[#f8f5ef] shadow-[0_10px_30px_rgba(8,18,37,0.04)] sm:rounded-[1.75rem]">
        <button
          type="button"
          onClick={() =>
            setOpenItem((prev) =>
              prev === "info-process" ? null : "info-process"
            )
          }
          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-7 sm:py-6"
        >
          <span className="text-[17px] font-semibold tracking-tight text-[#10203d] sm:text-[20px]">
            How our quote process works
          </span>
          <span className="shrink-0 text-[26px] leading-none text-[#7f1d1d]">
            {openItem === "info-process" ? "−" : "+"}
          </span>
        </button>

        {openItem === "info-process" && (
          <div className="border-t border-zinc-200 px-4 py-4 text-[15px] leading-7 text-zinc-600 sm:px-7 sm:py-6 sm:text-[17px] sm:leading-8 lg:text-[18px] lg:leading-9">
            <p>Getting a quote is simple.</p>

            <div className="mt-4 space-y-4 pl-3 sm:mt-5 sm:space-y-5 sm:pl-5">
              <div className="flex items-baseline gap-3">
                <span className="w-4 shrink-0 text-[14px] font-semibold leading-none text-[#7f1d1d] sm:text-[15px]">
                  1
                </span>
                <p className="m-0">
                   Submit a few details through the enquiry form.
                </p>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="w-4 shrink-0 text-[14px] font-semibold leading-none text-[#7f1d1d] sm:text-[15px]">
                  2
                </span>
                <p className="m-0">
                  We review your information and find the right options.
                </p>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="w-4 shrink-0 text-[14px] font-semibold leading-none text-[#7f1d1d] sm:text-[15px]">
                  3
                </span>
                <p className="m-0">
                  We’ll call you back to talk it through and help you choose the right cover.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-[#f8f5ef] shadow-[0_10px_30px_rgba(8,18,37,0.04)] sm:rounded-[1.75rem]">
        <button
          type="button"
          onClick={() =>
            setOpenItem((prev) => (prev === "info-about" ? null : "info-about"))
          }
          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-7 sm:py-6"
        >
          <span className="text-[17px] font-semibold tracking-tight text-[#10203d] sm:text-[20px]">
            Who we are
          </span>
          <span className="shrink-0 text-[26px] leading-none text-[#7f1d1d]">
            {openItem === "info-about" ? "−" : "+"}
          </span>
        </button>

        {openItem === "info-about" && (
          <div className="border-t border-zinc-200 px-4 py-4 text-[15px] leading-7 text-zinc-600 sm:px-7 sm:py-6 sm:text-[17px] sm:leading-8 lg:text-[18px] lg:leading-9">

            Apple Insurance Services has been helping customers since 1996, building long-term relationships through honest advice and reliable service.

            We take a straightforward, personal approach to help you find the right cover without the confusion.
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-[#f8f5ef] shadow-[0_10px_30px_rgba(8,18,37,0.04)] sm:rounded-[1.75rem]">
        <button
          type="button"
          onClick={() =>
            setOpenItem((prev) => (prev === "info-why" ? null : "info-why"))
          }
          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-7 sm:py-6"
        >
          <span className="text-[17px] font-semibold tracking-tight text-[#10203d] sm:text-[20px]">
            Why choose us
          </span>
          <span className="shrink-0 text-[26px] leading-none text-[#7f1d1d]">
            {openItem === "info-why" ? "−" : "+"}
          </span>
        </button>

        {openItem === "info-why" && (
          <div className="border-t border-zinc-200 px-4 py-4 text-[15px] leading-7 text-zinc-600 sm:px-7 sm:py-6 sm:text-[17px] sm:leading-8 lg:text-[18px] lg:leading-9">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                  ✓
                </span>
                <p className="m-0">
                  Over 25 years of experience
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                  ✓
                </span>
                <p className="m-0">
                  Trusted by taxi drivers and homeowners and businesses
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                  ✓
                </span>
                <p className="m-0">
                  Straightforward advice, explained properly
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                  ✓
                </span>
                <p className="m-0">
                  Personal support from a real team, not a call centre
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</section>

<section className="bg-[#f7f4ef] px-5 py-16 sm:px-8 sm:py-24 lg:px-20">
  <div className="mx-auto w-full max-w-5xl">
    <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
      <h2 className="text-3xl font-semibold tracking-tight text-[#10203d] sm:text-4xl">
        What our customers say
      </h2>
      <p className="mt-3 text-[15px] leading-6 text-zinc-700 sm:mt-4 sm:text-[17px] sm:leading-8 lg:text-[21px] lg:leading-8">
        Real feedback from people we've helped
      </p>
    </div>

    <div className="grid gap-3 sm:gap-5 lg:grid-cols-3">
      <div className="mx-auto flex h-full w-full max-w-[320px] flex-col rounded-[1.25rem] border border-zinc-200 bg-white p-4 shadow-[0_10px_30px_rgba(8,18,37,0.04)] sm:max-w-none sm:rounded-[1.75rem] sm:p-6">
        <div className="flex items-center gap-1 text-[#7f1d1d]">
          <span className="text-[15px] sm:text-lg">★</span>
          <span className="text-[15px] sm:text-lg">★</span>
          <span className="text-[15px] sm:text-lg">★</span>
          <span className="text-[15px] sm:text-lg">★</span>
          <span className="text-[15px] sm:text-lg">★</span>
        </div>

        <p className="mt-3 flex-1 text-[15px] leading-6 text-zinc-700 sm:mt-4 sm:text-[17px] sm:leading-8">
          “Very professional staff and good customer service.”
        </p>

        <div className="mt-4 border-t border-zinc-200 pt-3 sm:mt-6 sm:pt-4">
          <p className="font-semibold text-[#10203d]">Google Review</p>
          <p className="mt-1 text-sm text-zinc-500">Taxi Insurance Customer</p>
        </div>
      </div>

      <div className="mx-auto flex h-full w-full max-w-[320px] flex-col rounded-[1.25rem] border border-zinc-200 bg-white p-4 shadow-[0_10px_30px_rgba(8,18,37,0.04)] sm:max-w-none sm:rounded-[1.75rem] sm:p-6">
        <div className="flex items-center gap-1 text-[#7f1d1d]">
          <span className="text-[15px] sm:text-lg">★</span>
          <span className="text-[15px] sm:text-lg">★</span>
          <span className="text-[15px] sm:text-lg">★</span>
          <span className="text-[15px] sm:text-lg">★</span>
          <span className="text-[15px] sm:text-lg">★</span>
        </div>

        <p className="mt-3 flex-1 text-[15px] leading-6 text-zinc-700 sm:mt-4 sm:text-[17px] sm:leading-8">
          “Very reliable service, especially Adeel who makes everything feel personal.”
        </p>

        <div className="mt-4 border-t border-zinc-200 pt-3 sm:mt-6 sm:pt-4">
          <p className="font-semibold text-[#10203d]">Sheikh A.</p>
          <p className="mt-1 text-sm text-zinc-500">Home Insurance Customer</p>
        </div>
      </div>

      <div className="mx-auto flex h-full w-full max-w-[320px] flex-col rounded-[1.25rem] border border-zinc-200 bg-white p-4 shadow-[0_10px_30px_rgba(8,18,37,0.04)] sm:max-w-none sm:rounded-[1.75rem] sm:p-6">
        <div className="flex items-center gap-1 text-[#7f1d1d]">
          <span className="text-[15px] sm:text-lg">★</span>
          <span className="text-[15px] sm:text-lg">★</span>
          <span className="text-[15px] sm:text-lg">★</span>
          <span className="text-[15px] sm:text-lg">★</span>
          <span className="text-[15px] text-zinc-300 sm:text-lg">★</span>
        </div>

        <p className="mt-3 flex-1 text-[15px] leading-6 text-zinc-700 sm:mt-4 sm:text-[17px] sm:leading-8">
          “Been a customer for 7 years. Not the cheapest, but being able to deal with someone face to face makes it worth it.”
        </p>

        <div className="mt-4 border-t border-zinc-200 pt-3 sm:mt-6 sm:pt-4">
          <p className="font-semibold text-[#10203d]">Jan M.</p>
          <p className="mt-1 text-sm text-zinc-500">
            Taxi Insurance Customer
          </p>
        </div>
      </div>
    </div>
  </div>
</section>






      <section className="bg-[#f7f4ef] px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto w-full max-w-5xl rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(127,29,29,0.22),_transparent_24%),linear-gradient(135deg,#0b1730_0%,#122344_55%,#10203d_100%)] px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[680px]">
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Want to speak to someone directly?
              </h2>
              <p className="mt-3 text-[17px] leading-8 text-zinc-300 lg:text-[19px] lg:leading-9">
                Call our team for clear, straightforward advice on your insurance.
                    <br/>
                    Or request a free quote and we’ll call you back to talk it through.
                                  </p>

                                </div>

                                <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                                  <Link
                                    className="inline-flex h-14 min-w-[230px] items-center justify-center gap-3 rounded-2xl border border-[#7f1d1d] bg-white px-7 text-base font-semibold text-[#10203d] transition-all duration-200 hover:bg-[#7f1d1d] hover:text-white active:bg-[#7f1d1d] active:text-white"
                                    href="/#find-cover"
                                    onClick={(e) => {
                                      const isHomePage = window.location.pathname === "/";
                                      const el = document.getElementById("find-cover");

                                      if (isHomePage && el) {
                                        e.preventDefault();
                                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                                        window.history.replaceState(null, "", "#find-cover");
                                      }
                                    }}
                                  >
                                    Get a quote
                                    <span className="text-[#9f1d1d]">→</span>
                                  </Link>

                                  <a
                                    className="inline-flex h-14 min-w-[230px] items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-7 text-base font-semibold text-white transition-all duration-200 hover:border-[#7f1d1d] hover:bg-white/10 hover:text-[#7f1d1d] active:border-[#7f1d1d] active:bg-white/10 active:text-[#7f1d1d]"
                                    href="tel:01618812139"
                                  >
                                    Speak to our team
                                    <span className="text-[#9f1d1d]">→</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </section>

                  <footer className="bg-[#10203d] px-5 py-14 sm:px-8 sm:py-16 lg:px-16">
                <div className="mx-auto w-full max-w-5xl">
                  <div className="grid gap-12 border-b border-white/10 pb-10 md:grid-cols-[1.5fr_1fr]">
                    <div>
                    <Link href="/" className="relative inline-block shrink-0">
                <img
                  src="/icons/logo.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute -left-2 -top-16 h-32 w-32 object-contain opacity-80 sm:-left-4 sm:-top-16 sm:h-34 sm:w-34"
                />
<div className="relative z-10 pl-5 sm:pl-8">
  <p
    className={`${libreBaskerville.className} text-[9px] font-bold leading-[1] tracking-tight text-white sm:text-[16px] sm:leading-[0.95]`}
  >
    Apple
  </p>

  <p
    className={`${libreBaskerville.className} mt-0 text-[9px] font-bold leading-[1] tracking-tight text-white sm:-mt-0.5 sm:text-[16px] sm:leading-[0.95]`}
  >
    Insurance
  </p>

  <p className="mt-[1px] text-[4px] font-bold uppercase tracking-[0.06em] text-[#9f1d1d] sm:mt-1 sm:text-[7px] sm:tracking-[0.12em]">
    Services
  </p>
</div>
              </Link>


        <div className="mt-5 space-y-4 text-sm leading-7 text-white">
          <p>
            Apple Insurance Services Ltd
            <br />
            Registered in England and Wales. Company No. 11750703
            <br />
            Registered Office: 363 Barlow Moor Road, Chorlton, Manchester, M21 7FZ
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
              FCA
            </p>
            <p className="mt-3 text-sm leading-7 text-white">
              Apple Insurance Services Ltd is authorised and regulated by the
              Financial Conduct Authority.
            </p>
            <p className="text-sm leading-7 text-white">
              FCA Number: 841040
            </p>
          </div>

          <p>
            We act as an independent insurance intermediary and work with a
            panel of insurers to help find suitable cover.
          </p>
        </div>
      </div>

      <div className="pt-1">
        <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
          Contact
        </h4>
        <ul className="mt-4 space-y-3 text-sm text-white">
          <li>
            <a className="transition-colors hover:text-[#7f1d1d]" href="tel:01618812139">
              0161 881 2139
            </a>
          </li>
          <li>Apple Insurance Services</li>
          <li>363 Barlow Moor Rd</li>
          <li>Chorlton-cum-Hardy, Manchester</li>
          <li>M21 7FZ</li>
        </ul>

        <div className="mt-8">
          <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
            Legal
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-white">
            <li>
              <Link className="transition-colors hover:text-[#7f1d1d]" href="/privacy-notice">
                Privacy Notice
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-[#7f1d1d]" href="/contact">
                Contact Form
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="pt-6 text-sm text-white/80">
      <p>© Apple Insurance Services. All rights reserved.</p>
    </div>
  </div>
</footer>


    </div>
  );
}

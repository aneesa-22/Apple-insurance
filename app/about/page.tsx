"use client";

import Link from "next/link";
import { Instrument_Sans } from "next/font/google";
import PageFooter from "../components/site/PageFooter";
import QuotePageHeader from "../components/quote/QuotePageHeader";
import BackToHomeLink from "../components/site/BackToHomeLink";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function AboutPage() {
  return (
    <main className={`${instrumentSans.className} min-h-screen bg-white text-zinc-950`}>
      <QuotePageHeader activePage="about" />



      <section className="bg-white px-4 py-10 sm:px-8 sm:py-12 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">

          <BackToHomeLink className="mb-8" />
          
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#7f1d1d]">
              About Us
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#10203d] sm:text-4xl">
              About Apple Insurance Services
            </h1>
            <p className="mt-4 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
              Apple Insurance Services has been supporting customers since 1996,
              offering a straightforward and personal approach to taxi, home,
              property, and other insurance enquiries.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4ef] px-4 py-10 sm:px-8 sm:py-12 lg:px-16">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
            <h2 className="text-[21px] font-semibold tracking-tight text-[#10203d] sm:text-2xl">
              Our story
            </h2>
            <div className="mt-6 space-y-4 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
              <p>
Apple Insurance Services was established in Manchester in 1996 and has grown over the years to support thousands of customers across the UK.

              </p>
              <p>
                
Starting with taxi insurance, the business was built on a strong understanding of drivers and their needs. As demand grew, that same approach was extended to home, property, and general insurance.
              </p>
              <p>


While the range of cover has expanded, the focus has remained the same: clear advice, competitive pricing, and personal support from people you can actually speak to.              </p>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-[radial-gradient(circle_at_top_left,_rgba(127,29,29,0.28),_transparent_22%),radial-gradient(circle_at_85%_20%,_rgba(59,130,246,0.18),_transparent_26%),linear-gradient(135deg,#0b1730_0%,#122344_52%,#10203d_100%)] p-6 text-white shadow-[0_18px_50px_rgba(8,18,37,0.18),inset_0_1px_0_rgba(255,255,255,0.05)] sm:rounded-[2rem] sm:p-8">
            <h2 className="text-[21px] font-semibold tracking-tight text-white sm:text-2xl">
              At a glance
            </h2>

            <div className="mt-8 space-y-6">
              <div className="border-b border-white/12 pb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  Founded
                </p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  1996
                </p>
              </div>

              <div className="border-b border-white/12 pb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  Based in
                </p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Manchester
                </p>
              </div>

              <div className="border-b border-white/12 pb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  Cover types
                </p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Taxi, Home, Property, Motor
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  Approach
                </p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Friendly, personal support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-10 sm:px-8 sm:py-12 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-[#10203d] sm:text-4xl">
              Why customers choose us
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
              We are known for combining competitive pricing with personal,
              straightforward service. We understand that customers want clear
              help, honest advice, and a team they can trust.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.75rem] border border-zinc-200 bg-[#f7f4ef] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7f1d1d] sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_6px_18px_rgba(8,18,37,0.06)]">
                <img
                  src="/icons/trophy.svg"
                  alt="Established experience icon"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <h3 className="mt-5 text-[18px] font-semibold leading-tight tracking-tight text-[#10203d]">
                Established experience
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-zinc-600">
                Over 25 years of experience supporting customers across the UK.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-zinc-200 bg-[#f7f4ef] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7f1d1d] sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_6px_18px_rgba(8,18,37,0.06)]">
                <img
                  src="/icons/handshake.svg"
                  alt="Personal service icon"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <h3 className="mt-5 text-[18px] font-semibold leading-tight tracking-tight text-[#10203d]">
                Personal service
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-zinc-600">
                Real support from a team you can speak to, without confusing
                processes.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-zinc-200 bg-[#f7f4ef] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7f1d1d] sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_6px_18px_rgba(8,18,37,0.06)]">
                <img
                  src="/icons/taxi-thin.svg"
                  alt="Taxi specialists icon"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <h3 className="mt-5 text-[18px] font-semibold leading-tight tracking-tight text-[#10203d]">
                Taxi specialists
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-zinc-600">
                Strong roots in taxi insurance and a clear understanding of
                drivers&apos; needs.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-zinc-200 bg-[#f7f4ef] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7f1d1d] sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_6px_18px_rgba(8,18,37,0.06)]">
                <img
                  src="/icons/chat.svg"
                  alt="Clear guidance icon"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <h3 className="mt-5 text-[18px] font-semibold leading-tight tracking-tight text-[#10203d]">
                Clear guidance
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-zinc-600">
                Straightforward advice to help you find the right cover at a
                fair price.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-14 sm:px-8 lg:px-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-[1.75rem] bg-[radial-gradient(circle_at_top_left,_rgba(127,29,29,0.22),_transparent_24%),linear-gradient(135deg,#0b1730_0%,#122344_55%,#10203d_100%)] p-6 text-white shadow-[0_14px_40px_rgba(8,18,37,0.16)] sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[17px] text-zinc-300">
              Need help or want to speak to someone?
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Call our team today on{" "}
              <a href="tel:01618812139" className="text-[#9f1d1d]">
                0161 881 2139
              </a>
            </h2>
          </div>
          <Link
            href="/quotes/taxi"
            className="inline-flex h-14 items-center justify-center gap-3 rounded-[1.15rem] bg-[#9f1d1d] px-7 text-[15px] font-bold text-white transition-colors hover:bg-[#7f1d1d]"
          >
            Get a quote <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}

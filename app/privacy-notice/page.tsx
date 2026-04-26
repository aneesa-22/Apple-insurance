"use client";

import Link from "next/link";
import { Libre_Baskerville, Instrument_Sans } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import PageFooter from "../components/site/PageFooter";
import PageHeader from "../components/site/PageHeader";
import BackToHomeLink from "../components/site/BackToHomeLink";


const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function PrivacyNoticePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <main className={`${instrumentSans.className} min-h-screen bg-white text-zinc-950`}>
      <PageHeader />

      <section className="bg-white px-4 py-8 sm:px-8 sm:py-14 lg:px-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-8 sm:mb-10">
            <BackToHomeLink className="mb-8" />

            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#7f1d1d]">
              Privacy Notice
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#081225] sm:text-4xl">
              Privacy notice
            </h1>
            <p className="mt-4 max-w-3xl text-[15px] leading-7 text-zinc-600 sm:text-[17px] sm:leading-8">
              This privacy notice explains how Apple Insurance Services Limited
              collects, uses, stores, and protects your personal information
              when you contact us or request a quote.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-zinc-200 bg-white px-4 py-5 shadow-[0_10px_30px_rgba(8,18,37,0.06)] sm:rounded-3xl sm:p-8">
            <div className="space-y-8 text-[15px] leading-7 text-zinc-700 sm:space-y-10 sm:text-[17px] sm:leading-8">
              <section>
                <h2 className="text-[19px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Who we are
                </h2>
                <p className="mt-3">
                  Apple Insurance Services is committed to protecting your
                  privacy and handling your personal information responsibly.
                  This notice applies when you contact us by phone, email,
                  through our website, or when you request an insurance quote.
                </p>
              </section>

              <section>
                <h2 className="text-[19px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  What information we collect
                </h2>
                <div className="mt-3 space-y-4">
                  <p>
                    Depending on the type of enquiry, we may collect personal
                    information such as your name, address, phone number, email
                    address, date of birth, insurance history, property details,
                    vehicle details, and any other information you choose to
                    provide in relation to your enquiry.
                  </p>
                  <p>
                    In some cases, we may also collect financial information
                    where required to arrange or administer insurance policies
                    and related transactions.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-[19px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  How we use your information
                </h2>
                <div className="mt-3 space-y-4">
                  <p>We use your information to:</p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                        ✓
                      </span>
                      <p className="m-0">respond to your enquiry</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                        ✓
                      </span>
                      <p className="m-0">arrange and provide insurance quotations</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                        ✓
                      </span>
                      <p className="m-0">
                        communicate with you about your request or policy
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                        ✓
                      </span>
                      <p className="m-0">administer our services</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                        ✓
                      </span>
                      <p className="m-0">meet legal and regulatory obligations</p>
                    </div>
                  </div>

                  <p>
                    With your consent, we may also use your information to
                    inform you about relevant products and services.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-[19px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Who we may share your information with
                </h2>
                <div className="mt-3 space-y-4">
                  <p>We may share your information with:</p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                        ✓
                      </span>
                      <p className="m-0">insurers and underwriting partners</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                        ✓
                      </span>
                      <p className="m-0">brokers and intermediaries</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                        ✓
                      </span>
                      <p className="m-0">
                        service providers who support our business operations
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                        ✓
                      </span>
                      <p className="m-0">regulatory or legal bodies where required</p>
                    </div>
                  </div>

                  <p>
                    This is only done where necessary to process your enquiry,
                    arrange cover, administer a policy, or comply with legal
                    obligations.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-[19px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  How we store your information
                </h2>
                <p className="mt-3">
                  We take reasonable steps to keep your information secure and
                  to protect it from loss, misuse, unauthorised access,
                  disclosure, or alteration. Your data is only kept for as long
                  as necessary for the purposes for which it was collected,
                  including legal, regulatory, and business requirements.
                </p>
              </section>

              <section>
                <h2 className="text-[19px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Your rights
                </h2>
                <div className="mt-3 space-y-4">
                  <p>
                    You may have rights in relation to your personal data,
                    including:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                        ✓
                      </span>
                      <p className="m-0">
                        the right to request access to the information we hold
                        about you
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                        ✓
                      </span>
                      <p className="m-0">
                        the right to request corrections to inaccurate data
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="shrink-0 text-[15px] leading-7 text-[#7f1d1d] sm:text-[16px]">
                        ✓
                      </span>
                      <p className="m-0">
                        the right to request deletion or restriction of
                        processing in certain circumstances
                      </p>
                    </div>
                  </div>

                  <p>
                    These rights are subject to applicable legal and regulatory
                    requirements.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-[19px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Confidentiality
                </h2>
                <p className="mt-3">
                  We treat your personal information as confidential and will
                  only disclose it with your consent, where necessary to provide
                  our services, or where required by law or regulation.
                </p>
              </section>

              <section>
                <h2 className="text-[19px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Cookies and website use
                </h2>
                <div className="mt-3 space-y-4">
                  <p>
                    Our website may use cookies or similar technologies to
                    ensure the site functions correctly and to improve user
                    experience.
                  </p>
                  <p>
                    If additional tools such as analytics or tracking
                    technologies are introduced, this notice will be updated
                    accordingly.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-[19px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Providing information to insurers
                </h2>
                <div className="mt-3 space-y-4">
                  <p>
                    When requesting a quote or arranging insurance, it is
                    important that the information you provide is accurate and
                    complete.
                  </p>
                  <p>
                    You must inform us of any changes to your circumstances, as
                    this may affect your cover. Failure to provide accurate
                    information may impact the validity of your policy.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-[19px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Contact us
                </h2>
                <p className="mt-3">
                  If you have any questions about this privacy notice or how
                  your information is handled, you can contact Apple Insurance
                  Services using the details below.
                </p>

                <div className="mt-4 rounded-2xl border border-zinc-200 bg-[#f7f4ef] p-4 sm:p-5">
                  <p className="font-semibold text-[#081225]">
                    Apple Insurance Services
                  </p>
                  <p className="mt-2">363 Barlow Moor Rd</p>
                  <p>Chorlton-cum-Hardy</p>
                  <p>Manchester M21 7FZ</p>
                  <p className="mt-3">
                    Phone:{" "}
                    <a
                      href="tel:01618812139"
                      className="font-semibold text-[#7f1d1d] transition-colors hover:text-[#5f1414]"
                    >
                      0161 881 2139
                    </a>
                  </p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:appleinsuranceservices@yahoo.co.uk"
                      className="font-semibold text-[#7f1d1d] transition-colors hover:text-[#5f1414]"
                    >
                      appleinsuranceservices@yahoo.co.uk
                    </a>
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-[19px] font-semibold tracking-tight text-[#081225] sm:text-2xl">
                  Changes to this notice
                </h2>
                <p className="mt-3">
                  We may update this privacy notice from time to time to reflect
                  changes in our services, legal requirements, or how we handle
                  personal information. Any updates will be published on this
                  page.
                </p>
              </section>

              <section>
                <p className="text-sm text-zinc-500">
                  Last updated: 20 April 2026
                </p>
              </section>
            </div>
          </div>

          <div className="mt-8 rounded-[1.75rem] bg-[radial-gradient(circle_at_top_left,_rgba(127,29,29,0.22),_transparent_24%),linear-gradient(135deg,#07101f_0%,#0c1730_55%,#081225_100%)] px-5 py-6 sm:rounded-[2rem] sm:px-8 sm:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-[22px] font-semibold tracking-tight text-white sm:text-2xl">
                  Need help with an enquiry?
                </h2>
                <p className="mt-2 text-[15px] leading-7 text-zinc-300 sm:text-[17px] sm:leading-8">
                  If you would like to speak to someone directly, our team is
                  here to help.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-[#7f1d1d] bg-white px-6 text-sm font-semibold text-[#081225] transition-all duration-200 hover:bg-[#7f1d1d] hover:text-white sm:w-auto sm:min-w-[140px]"
                >
                  Contact us
                </Link>

                <a
                  href="tel:01618812139"
                  className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white transition-all duration-200 hover:border-[#7f1d1d] hover:bg-white/10 hover:text-[#7f1d1d] sm:w-auto sm:min-w-[170px]"
                >
                  Call our team
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

       <PageFooter />
    </main>
  );
}

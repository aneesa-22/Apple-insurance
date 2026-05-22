"use client";

import Link from "next/link";
import { Instrument_Sans } from "next/font/google";
import { useState } from "react";
import PageFooter from "./components/site/PageFooter";
import QuotePageHeader from "./components/quote/QuotePageHeader";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const serviceCards = [
  {
    title: "Taxi Insurance",
    description:
      "Specialist cover for taxi drivers, private hire drivers and full-time road work.",
    icon: "/icons/taxi-thin.svg",
    href: "/quotes/taxi",
  },
  {
    title: "Home Insurance",
    description:
      "Flexible home cover for buildings, contents and everyday peace of mind.",
    icon: "/icons/home.svg",
    href: "/quotes/home",
  },
  {
    title: "Landlord Insurance",
    description:
      "Cover for rental properties, tenants and property owner responsibilities.",
    icon: "/icons/building.svg",
    href: "/quotes/landlord",
  },
  {
    title: "Motor Insurance",
    description:
      "Support for motor trade businesses, vehicles and specialist road risks.",
    icon: "/icons/engine.svg",
    href: "/quotes/motor",
  },
];

const partners = [
  { name: "Inshur", logo: "/partners/inshur.png" },
  { name: "AXA", logo: "/partners/axa.png" },
  { name: "Sabre", logo: "/partners/sabre.png" },
  { name: "Collingwood", logo: "/partners/collingwood.png" },
  { name: "Haven", logo: "/partners/haven.png" },
];

const processSteps = [
  {
    number: "1",
    title: "Submit your details",
    copy: "Fill in a few quick details using our enquiry form.",
    icon: "/icons/article.svg",
  },
  {
    number: "2",
    title: "We find the right cover",
    copy: "We review your information and compare the best options.",
    icon: "/icons/magnifying-glass.svg",
  },
  {
    number: "3",
    title: "We’ll be in touch",
    copy: "We’ll call you back to talk through your options.",
    icon: "/icons/home-phone.svg",
  },
];

const whyChooseItems = [
  {
    title: "Over 25 years of experience",
    copy: "A long history of helping customers find reliable cover.",
    icon: "/icons/clock-blue.svg",
  },
  {
    title: "Trusted by drivers & businesses",
    copy: "Support for individuals, drivers, landlords and businesses.",
    icon: "/icons/users.svg",
  },
  {
    title: "Straightforward advice",
    copy: "No jargon, no confusion. Just clear guidance.",
    icon: "/icons/chats.svg",
  },
  {
    title: "Personal support",
    copy: "Speak to a friendly UK-based team when you need help.",
    icon: "/icons/headset-blue.svg",
  },
];

const faqItems = [
  {
    question: "How long does it take to get a quote?",
    answer: (
      <>
        Once we have your details, our team will review your enquiry and aim to
        get back to you within <strong>24 hours</strong>. It only takes a few
        details to get started, and we’ll guide you through the rest.
      </>
    ),
  },
  {
    question: "What details do I need to get a quote?",
    answer:
      "We’ll usually need a few basic details such as your contact information and the type of cover you're looking for. Depending on the policy, we may ask for additional information so we can find the right options for you.",
  },
  {
    question: "Do you offer cover for new drivers?",
    answer:
      "Yes. We work with a range of insurers and can help explore options for both experienced and newer drivers. Every quote is assessed individually based on your circumstances.",
  },
  {
    question: "Can I speak to someone directly?",
    answer: (
      <>
        Of course. If you’d rather speak to a person, give our team a call on{" "}
        <strong>0161 881 2139</strong> and we’ll be happy to help.
      </>
    ),
  },
  {
    question: "Do you offer fleet and business cover?",
    answer:
      "Yes. We can help arrange cover for fleets and business vehicles, with policies tailored to suit different business needs and requirements.",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<string | null>(faqItems[0].question);

  return (
    <div
      className={`${instrumentSans.className} min-h-screen bg-white text-zinc-950`}
    >
      <QuotePageHeader activePage="taxi" />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(127,29,29,0.28),_transparent_22%),linear-gradient(135deg,#0b1730_0%,#122344_55%,#10203d_100%)] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 hidden h-full w-1/2 opacity-35 lg:block [background-image:radial-gradient(rgba(255,255,255,0.32)_1px,transparent_1px)] [background-size:18px_18px]"
        />
        <div
          aria-hidden="true"
          className="absolute right-[-10%] top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full bg-[#9f1d1d]/25 blur-3xl lg:block"
        />

        <div className="relative mx-auto w-full max-w-6xl">
          
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tailored insurance for the road ahead.
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-8 text-zinc-200 sm:text-[19px]">
            Specialist insurance cover for taxi drivers, fleets and private hire
            businesses across the UK.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-[14px] font-semibold text-white">
            <div className="flex items-center gap-1 text-[#9f1d1d]">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
            <span className="h-5 w-px bg-white/25" />
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-[#9f1d1d]">
                ✓
              </span>
              <span>FCA regulated</span>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex h-14 min-w-[160px] items-center justify-between gap-5 rounded-[1.15rem] border border-white/10 bg-white px-7 text-[15px] font-bold text-[#10203d] shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-all duration-200 hover:bg-[#9f1d1d] hover:text-white"
            >
              <span>Get a quote</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="find-cover" className="bg-white px-5 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#9f1d1d]">
              Our Services
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#10203d] sm:text-4xl">
              Insurance that works for you
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map((card) => (
              <article
                key={card.title}
                className="flex min-h-[250px] flex-col rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-[0_12px_34px_rgba(8,18,37,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#9f1d1d]/50 hover:shadow-[0_18px_44px_rgba(8,18,37,0.12)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f4ef]">
                  <img
                    src={card.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <h3 className="mt-6 text-[19px] font-bold tracking-tight text-[#10203d]">
                  {card.title}
                </h3>
                <p className="mt-3 flex-1 text-[15px] leading-7 text-zinc-600">
                  {card.description}
                </p>
                <Link
                  href={card.href}
                  className="mt-5 inline-flex items-center gap-2 text-[14px] font-bold text-[#9f1d1d] transition-colors hover:text-[#7f1d1d]"
                >
                  Get a quote <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4ef] px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#10203d] sm:text-3xl">
              Our insurance partners
            </h2>
            <p className="mt-3 text-[16px] leading-7 text-zinc-600">
              We work with trusted UK insurers to find cover that’s right for
              you.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex h-20 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 shadow-[0_10px_28px_rgba(8,18,37,0.04)]"
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="max-h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-6xl text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#9f1d1d]">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#10203d] sm:text-4xl">
            Getting a quote is simple
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {processSteps.map((step) => (
              <div key={step.title} className="relative">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 bg-[#f7f4ef]">
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#9f1d1d] text-[12px] font-bold text-white">
                    {step.number}
                  </span>
                  <img
                    src={step.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <h3 className="mt-5 text-[17px] font-bold text-[#10203d]">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-[28ch] text-sm leading-6 text-zinc-600">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4ef] px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-6xl rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-[0_12px_34px_rgba(8,18,37,0.06)] sm:p-8">
          <p className="text-center text-[12px] font-bold uppercase tracking-[0.18em] text-[#9f1d1d]">
            Why choose Apple Insurance?
          </p>
          <h2 className="sr-only">Why choose Apple Insurance</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyChooseItems.map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#10203d]/15 bg-[#f7f4ef]">
                  <img
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <h3 className="mt-4 text-[15px] font-bold text-[#10203d]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto grid w-full max-w-6xl gap-6 rounded-[1.75rem] border border-zinc-200 bg-[#f7f4ef] p-5 shadow-[0_12px_34px_rgba(8,18,37,0.06)] sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[1.35rem] bg-white p-6">
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#9f1d1d]">
              FAQs
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#10203d]">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-zinc-600">
              Answers to the most common questions about our insurance and quote
              process.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#9f1d1d] px-5 text-sm font-bold text-[#9f1d1d] transition-colors hover:bg-[#9f1d1d] hover:text-white"
            >
              Contact us <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="space-y-3">
            {faqItems.map((item) => {
              const isOpen = openFaq === item.question;

              return (
                <div
                  key={item.question}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq((current) =>
                        current === item.question ? null : item.question
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-bold text-[#10203d]"
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <span className="text-xl text-[#10203d]">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-zinc-200 px-5 py-4 text-sm leading-6 text-zinc-600">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
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
    </div>
  );
}

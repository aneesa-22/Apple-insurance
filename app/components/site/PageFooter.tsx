import Link from "next/link";
import { Libre_Baskerville } from "next/font/google";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function QuoteFooter() {
  return (<footer className="bg-[#10203d] px-5 py-14 sm:px-8 sm:py-16 lg:px-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid gap-12 border-b border-white/10 pb-10 md:grid-cols-[1.2fr_1fr_1fr_0.8fr]">
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

              <p className="mt-5 max-w-[23ch] text-sm leading-7 text-zinc-400">
                Apple Insurance Services Ltd is authorised and regulated by the
                Financial Conduct Authority (FCA No. 841040)
              </p>
            </div>

            <div className="pt-1">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-400">
                Quick Links
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              
                <li>
                  <Link
                    className="transition-colors hover:text-white"
                    href="/quotes/taxi"
                  >
                    Taxi 
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-white"
                    href="/quotes/home"
                  >
                    Home 
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-white"
                    href="/quotes/landlord"
                  >
                    Landlord
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-white"
                    href="/quotes/motor"
                  >
                    Motor
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-white"
                    href="/about"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="pt-1">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-400">
                Contact
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                <li>
                  <a
                    className="transition-colors hover:text-white"
                    href="tel:01618812139"
                  >
                    0161 881 2139
                  </a>
                </li>
                <li>Apple Insurance Services</li>
                <li>363 Barlow Moor Rd</li>
                <li>Chorlton-cum-Hardy, Manchester</li>
                <li>M21 7FZ</li>
              </ul>
            </div>

            <div className="pt-1">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-400">
                Legal
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                <li>
                  <Link
                    className="transition-colors hover:text-white"
                    href="/privacy-notice"
                  >
                    Privacy Notice
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-white"
                    href="/contact"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© Apple Insurance Services. All rights reserved.</p>
            <p>
              Developed by{" "}
              <a
                href="https://linearstudio.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-zinc-300 transition-colors hover:text-white"
              >
                Linear Studio
              </a>
            </p>
          </div>
        </div>
      </footer>
       );
}

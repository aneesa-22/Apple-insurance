import Link from "next/link";
import { Libre_Baskerville } from "next/font/google";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function QuoteFooter() {
  return (<footer className="bg-[#081225] px-5 py-14 sm:px-8 sm:py-16 lg:px-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid gap-12 border-b border-white/10 pb-10 md:grid-cols-[1.2fr_1fr_1fr_0.8fr]">
            <div>
              <Link href="/" className="relative inline-block shrink-0">
                <img
                  src="/icons/logo.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute -left-3 -top-16 h-34 w-34 object-contain opacity-80 sm:-left-4 sm:-top-14 sm:h-30 sm:w-30"
                />

                <div className="relative z-10 pl-5 sm:pl-8">
                  <p
                    className={`${libreBaskerville.className} text-[12px] font-bold leading-[0.95] tracking-tight text-white sm:text-[18px]`}
                  >
                    Apple
                  </p>
                  <p
                    className={`${libreBaskerville.className} -mt-0.5 text-[12px] font-bold leading-[0.95] tracking-tight text-white sm:text-[18px]`}
                  >
                    Insurance
                  </p>
                  <p className="mt-0.5 pl-[1px] text-[6px] font-medium uppercase tracking-[0.26em] text-[#7f1d1d] sm:mt-1 sm:text-[7px]">
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

          <div className="pt-6 text-sm text-zinc-500">
            <p>© Apple Insurance Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
       );
}
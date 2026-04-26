import Link from "next/link";

type BackToHomeLinkProps = {
  className?: string;
};

export default function BackToHomeLink({
  className = "",
}: BackToHomeLinkProps) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-3 text-[16px] font-semibold text-[#7f1d1d] transition-colors duration-200 hover:text-[#5f1414] sm:text-[18px] ${className}`}
    >
      <span className="text-[18px] leading-none transition-transform duration-200 group-hover:-translate-x-1 sm:text-[20px]">
        ←
      </span>

      <span className="relative">
        Back to home
        <span className="absolute left-0 top-full mt-1 h-[2px] w-0 rounded-full bg-[#7f1d1d] transition-all duration-200 group-hover:w-full" />
      </span>
    </Link>
  );
}

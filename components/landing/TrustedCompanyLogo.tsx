
import type { TrustedCompany } from "@/types/landing";

export function TrustedCompanyLogo({ name, logoSrc }: TrustedCompany) {
  return (
    <div className="group inline-flex w-max items-center justify-center grayscale transition-all duration-200 hover:grayscale-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt={`${name} logo`}
        className="h-9 w-auto opacity-55 transition-all duration-200 ease-in-out group-hover:scale-[1.03] group-hover:opacity-100"
      />
    </div>
  );
}

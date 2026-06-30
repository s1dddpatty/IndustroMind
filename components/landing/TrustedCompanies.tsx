import { TRUSTED_COMPANIES } from "@/constants/landing";
import { MotionFade } from "@/components/shared/MotionFade";
import { TrustedCompanyLogo } from "./TrustedCompanyLogo";

export default function TrustedCompanies() {
  return (
    <section className="border-b border-gray-100 bg-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-8">
        <MotionFade>
          <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-gray-400">
            Built for modern industrial operations
          </h2>
        </MotionFade>
        <div className="flex w-full flex-wrap items-center justify-center gap-12 lg:justify-between lg:gap-0">
          {TRUSTED_COMPANIES.map((company, i) => (
            <MotionFade key={company.name} delay={0.1 + i * 0.05}>
              <TrustedCompanyLogo {...company} />
            </MotionFade>
          ))}
        </div>
      </div>
    </section>
  );
}

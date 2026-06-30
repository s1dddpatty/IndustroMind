import { BrandLogo } from "@/components/shared/BrandLogo";
import { NAV_LINKS } from "@/constants/landing";

export default function FooterPlaceholder() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <BrandLogo />
            <p className="text-center text-sm text-gray-500 sm:text-left">
              Turn industrial knowledge into operational intelligence.
            </p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:justify-end md:gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
          <p className="text-sm text-gray-400">© 2026 IndustroMind. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-gray-400">
            <a href="#" className="transition-colors hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-gray-900">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

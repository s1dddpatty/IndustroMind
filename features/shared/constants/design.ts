export const DESIGN = {
  colors: {
    background: {
      default: "bg-[#0A0A0B]", // Dark charcoal background
      panel: "bg-[#111113]",   // Slightly lighter for panels/cards
      elevated: "bg-[#1A1A1D]",// For dropdowns/modals
      highlight: "bg-[#1E1E22]", // Hover states
    },
    brand: {
      primary: "text-[#52B788]",
      primaryBg: "bg-[#52B788]",
      primaryHover: "hover:bg-[#40916C]",
      light: "text-[#74C69D]",
      dark: "text-[#1B4332]",
    },
    text: {
      primary: "text-white",
      secondary: "text-gray-400",
      muted: "text-gray-500",
      accent: "text-brand-light",
    },
    border: {
      default: "border-[#1E1E22]",
      hover: "border-[#2A2A30]",
      focus: "border-brand-primary",
    },
    status: {
      success: { text: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
      warning: { text: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
      danger: { text: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
      info: { text: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    }
  },
  spacing: {
    page: "p-6 lg:p-8",
    panel: "p-5",
    gap: "gap-6",
    cardGap: "gap-4"
  },
  radius: {
    sm: "rounded-md",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    full: "rounded-full"
  },
  shadows: {
    sm: "shadow-sm",
    md: "shadow-md shadow-black/20",
    lg: "shadow-lg shadow-black/40",
    glow: "shadow-[0_0_15px_rgba(82,183,136,0.15)]"
  },
  animations: {
    transition: "transition-all duration-200 ease-in-out",
    hover: "hover:-translate-y-1",
  }
};

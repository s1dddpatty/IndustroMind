import { FEATURE_CARDS } from "@/constants/landing";
import FeatureCard from "./FeatureCard";

export default function FeatureCards() {
  return (
    <section id="product" className="border-t border-gray-100 bg-gray-50/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Intelligence at every layer
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Everything you need to unify operations, empower your teams, and build a safer industrial environment.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURE_CARDS.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}

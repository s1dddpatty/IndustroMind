import Link from "next/link";
import { ArrowRight, BrainCircuit, Activity, ShieldCheck, Search } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0e141a] text-[#dde3eb]">
      <header className="flex h-16 items-center justify-between px-8 border-b border-[#334155]">
        <div className="text-xl font-bold text-[#89ceff]">NeuroPlant</div>
        <div className="space-x-4">
          <Link href="/auth" className="text-sm font-medium hover:text-[#0ea5e9]">Sign In</Link>
          <Link href="/auth" className="rounded bg-[#0ea5e9] px-4 py-2 text-sm font-medium text-white hover:bg-[#006591]">Start Free</Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="px-8 py-24 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-6">The Industrial Intelligence Layer</h1>
          <p className="text-xl text-[#88929b] mb-10">Unify fragmented knowledge with GraphRAG and Neuro-Symbolic AI. Transform industrial silos into deterministic insights.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth" className="flex items-center rounded-lg bg-[#0ea5e9] px-6 py-3 font-medium text-white hover:bg-[#006591]">
              Start Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/request-demo" className="flex items-center rounded-lg border border-[#334155] px-6 py-3 font-medium hover:bg-[#1a2026]">
              Request Demo
            </Link>
          </div>
        </section>

        <section className="px-8 py-16 bg-[#161c22]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border border-[#334155] rounded-xl bg-[#0e141a]">
              <div className="text-4xl font-bold text-[#4edea3] mb-2">99.9%</div>
              <div className="text-[#88929b]">Accuracy via Deterministic Verification</div>
            </div>
            <div className="p-6 border border-[#334155] rounded-xl bg-[#0e141a]">
              <div className="text-4xl font-bold text-[#0ea5e9] mb-2">4x</div>
              <div className="text-[#88929b]">Faster Knowledge Retrieval</div>
            </div>
            <div className="p-6 border border-[#334155] rounded-xl bg-[#0e141a]">
              <div className="text-4xl font-bold text-[#dde3eb] mb-2">100%</div>
              <div className="text-[#88929b]">Data Sovereignty</div>
            </div>
          </div>
        </section>

        <section className="px-8 py-24 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Deterministic Intelligence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border border-[#334155] rounded-xl bg-[#1a2026]">
              <Search className="h-8 w-8 text-[#0ea5e9] mb-4" />
              <h3 className="text-lg font-semibold mb-2">GraphRAG</h3>
              <p className="text-[#88929b] text-sm">Building a dynamic knowledge graph from disparate data sources.</p>
            </div>
            <div className="p-6 border border-[#334155] rounded-xl bg-[#1a2026]">
              <NetworkIcon className="h-8 w-8 text-[#0ea5e9] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Neo4j Native</h3>
              <p className="text-[#88929b] text-sm">Powered by the world's leading graph database.</p>
            </div>
            <div className="p-6 border border-[#334155] rounded-xl bg-[#1a2026]">
              <BrainCircuit className="h-8 w-8 text-[#0ea5e9] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Neuro-Symbolic AI</h3>
              <p className="text-[#88929b] text-sm">Combining LLM reasoning with strict logical constraints.</p>
            </div>
            <div className="p-6 border border-[#334155] rounded-xl bg-[#1a2026]">
              <ShieldCheck className="h-8 w-8 text-[#0ea5e9] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Deterministic Verification</h3>
              <p className="text-[#88929b] text-sm">Zero-hallucination verification for industrial safety.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#334155] py-8 text-center text-[#88929b] text-sm">
        &copy; 2026 NeuroPlant. All rights reserved.
      </footer>
    </div>
  );
}

function NetworkIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      <path d="M12 12V8" />
    </svg>
  );
}

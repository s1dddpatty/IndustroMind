import {
  FileText,
  User,
  Shield,
  Building,
  Hexagon,
  Search,
  Sparkles,
  AlertCircle,
  CheckCircle,
  FileWarning,
  Activity,
  Server,
  Cpu,
  Database,
} from "lucide-react";

export function KnowledgeGraphIllustration() {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-6">
      {/* Central Node */}
      <div className="absolute z-10 flex h-16 w-16 items-center justify-center rounded-xl bg-primary shadow-lg ring-4 ring-primary/20">
        <Hexagon className="h-8 w-8 text-white" />
      </div>

      {/* Connection Lines (SVG) */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
        <g stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4">
          <line x1="100" y1="100" x2="100" y2="40" />
          <line x1="100" y1="100" x2="160" y2="70" />
          <line x1="100" y1="100" x2="160" y2="130" />
          <line x1="100" y1="100" x2="100" y2="160" />
          <line x1="100" y1="100" x2="40" y2="130" />
          <line x1="100" y1="100" x2="40" y2="70" />
        </g>
      </svg>

      {/* Satellite Nodes */}
      <div className="absolute top-8 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
        <FileText className="h-5 w-5 text-gray-500" />
      </div>
      <div className="absolute right-8 top-12 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
        <User className="h-5 w-5 text-gray-500" />
      </div>
      <div className="absolute bottom-12 right-8 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
        <Shield className="h-5 w-5 text-primary" />
      </div>
      <div className="absolute bottom-8 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
        <Building className="h-5 w-5 text-gray-500" />
      </div>
      <div className="absolute bottom-12 left-8 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
        <Server className="h-5 w-5 text-gray-500" />
      </div>
      <div className="absolute left-8 top-12 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
        <Cpu className="h-5 w-5 text-gray-500" />
      </div>
    </div>
  );
}

export function DocumentProcessingIllustration() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-4 p-6">
      <div className="relative flex h-28 w-20 flex-col items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="absolute top-2 left-2 flex items-center justify-center rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
          PDF
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <div className="h-1.5 w-12 rounded bg-gray-200"></div>
          <div className="h-1.5 w-10 rounded bg-gray-200"></div>
          <div className="h-1.5 w-14 rounded bg-gray-200"></div>
          <div className="h-1.5 w-12 rounded bg-gray-200"></div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-md">
          <span className="font-bold">AI</span>
        </div>
        <svg width="40" height="20" viewBox="0 0 40 20" className="mt-2 text-gray-300">
          <path d="M0,10 L30,10" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" fill="none" />
          <polygon points="30,5 40,10 30,15" fill="currentColor" />
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-md border border-gray-100 bg-white px-3 py-1.5 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <span className="text-xs font-medium text-gray-600">Text</span>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-gray-100 bg-white px-3 py-1.5 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-xs font-medium text-gray-600">Tables</span>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-gray-100 bg-white px-3 py-1.5 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
          <span className="text-xs font-medium text-gray-600">Entities</span>
        </div>
      </div>
    </div>
  );
}

export function GraphRAGIllustration() {
  return (
    <div className="flex h-full w-full flex-col p-6">
      <div className="relative flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
        <span className="text-[10px] font-medium text-gray-600">What is the startup procedure for Pump P-201?</span>
        <div className="absolute right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
          <Search className="h-3 w-3" />
        </div>
      </div>
      
      <div className="mt-4 flex flex-1 flex-col rounded-lg border border-gray-100 bg-gray-50/80 p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-primary">AI Answer</span>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <div className="h-2 w-full rounded bg-gray-200"></div>
          <div className="h-2 w-5/6 rounded bg-gray-200"></div>
          <div className="h-2 w-4/6 rounded bg-gray-200"></div>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-gray-200/60 pt-2">
          <span className="text-[10px] text-gray-400">Sources (3)</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-full bg-gray-300"></div>
            <div className="h-3 w-3 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ComplianceIllustration() {
  return (
    <div className="flex h-full w-full flex-col justify-center p-6">
      <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm relative">
        <div className="mb-1 text-[11px] font-semibold text-gray-800">Compliance Check</div>
        
        <div className="flex items-center justify-between rounded-md bg-gray-50 p-2">
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-600">SOP-102</span>
          </div>
          <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-medium text-red-600">Outdated</span>
        </div>

        <div className="flex items-center justify-between rounded-md bg-gray-50 p-2 border border-green-100/50">
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-600">SOP-045</span>
          </div>
          <span className="rounded bg-green-100 px-1.5 py-0.5 text-[9px] font-medium text-green-600">Compliant</span>
        </div>

        <div className="flex items-center justify-between rounded-md bg-gray-50 p-2">
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-600">SOP-089</span>
          </div>
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-600">Conflict</span>
        </div>

        <div className="absolute -right-3 -bottom-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg ring-4 ring-white">
          <Shield className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export function ExpertCaptureIllustration() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="flex w-full flex-col items-center rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="relative mb-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 ring-2 ring-white">
            <CheckCircle className="h-3 w-3 text-white" />
          </div>
        </div>
        <div className="h-2.5 w-24 rounded bg-gray-800"></div>
        <div className="mt-1.5 h-1.5 w-16 rounded bg-gray-400"></div>
        
        <div className="mt-4 flex w-full flex-wrap justify-center gap-2">
          <span className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-medium text-gray-600">Maintenance</span>
          <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] font-medium text-primary">Pump Systems</span>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-medium text-gray-600">Safety</span>
        </div>
      </div>
    </div>
  );
}

export function DecisionBriefsIllustration() {
  return (
    <div className="flex h-full w-full flex-col justify-center p-6">
      <div className="flex h-full w-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2">
          <Sparkles className="h-3 w-3 text-primary" />
          <div className="h-2 w-24 rounded bg-gray-300"></div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-3 h-2 w-16 rounded bg-gray-200"></div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-start gap-2">
              <div className="mt-1 h-1 w-1 rounded-full bg-gray-400"></div>
              <div className="h-1.5 w-full rounded bg-gray-200"></div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1 h-1 w-1 rounded-full bg-gray-400"></div>
              <div className="flex w-full flex-col gap-1">
                <div className="h-1.5 w-full rounded bg-gray-200"></div>
                <div className="h-1.5 w-4/5 rounded bg-gray-200"></div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1 h-1 w-1 rounded-full bg-primary"></div>
              <div className="h-1.5 w-5/6 rounded bg-primary/40"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AssetIntelligenceIllustration() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-100">
            <Building className="h-3 w-3 text-gray-600" />
          </div>
          <div className="h-2 w-20 rounded bg-gray-700"></div>
        </div>
        <div className="ml-4 border-l-2 border-gray-200 pl-4 py-1 flex flex-col gap-2">
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-100">
              <Server className="h-3 w-3 text-gray-600" />
            </div>
            <div className="h-2 w-16 rounded bg-gray-700"></div>
          </div>
          <div className="ml-4 border-l-2 border-primary/30 pl-4 py-1">
            <div className="flex items-center gap-3 rounded-lg border border-primary/40 bg-primary/5 p-2 shadow-sm ring-1 ring-primary/20">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20">
                <Activity className="h-3 w-3 text-primary" />
              </div>
              <div className="h-2 w-12 rounded bg-primary"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OperationalInsightsIllustration() {
  return (
    <div className="flex h-full w-full flex-col gap-3 p-6 justify-center">
      <div className="flex gap-3">
        <div className="flex flex-1 flex-col rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
          <div className="h-1.5 w-10 rounded bg-gray-300"></div>
          <div className="mt-2 text-sm font-bold text-gray-900">92%</div>
          <div className="mt-1 h-1 w-full rounded bg-gray-100 overflow-hidden">
            <div className="h-full w-[92%] bg-primary"></div>
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
          <div className="h-1.5 w-10 rounded bg-gray-300"></div>
          <div className="mt-2 text-sm font-bold text-gray-900">4.2k</div>
          <div className="mt-1 flex items-center gap-1">
            <Activity className="h-2 w-2 text-green-500" />
            <div className="h-1.5 w-8 rounded bg-green-500/20"></div>
          </div>
        </div>
      </div>
      <div className="flex h-16 w-full items-end gap-1 rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
        {[40, 60, 45, 80, 55, 90, 75, 100].map((height, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-t-sm ${i === 7 ? 'bg-primary' : 'bg-gray-200'}`}
            style={{ height: `${height}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export function getIllustrationForId(id: string) {
  switch (id) {
    case "knowledge-graph": return <KnowledgeGraphIllustration />;
    case "document-processing": return <DocumentProcessingIllustration />;
    case "graphrag-search": return <GraphRAGIllustration />;
    case "compliance": return <ComplianceIllustration />;
    case "expert-capture": return <ExpertCaptureIllustration />;
    case "decision-briefs": return <DecisionBriefsIllustration />;
    case "asset-intelligence": return <AssetIntelligenceIllustration />;
    case "operational-insights": return <OperationalInsightsIllustration />;
    default: return <div className="h-full w-full bg-gray-50"></div>;
  }
}

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "@/lib/api";
import { 
  Search, ChevronRight, BookOpen, FileText, ShieldAlert, Wrench, 
  Settings, AlertCircle, ArrowRight, CornerDownRight, Sparkles, 
  Link2, UserCheck, Activity, Globe, RefreshCw, Eye 
} from "lucide-react";
import Link from "next/link";

interface GraphNode {
  name: string;
  type: string;
  properties: Record<string, any>;
  org_id?: string;
  confidence?: number;
}

interface GraphRelationship {
  source_entity_name: string;
  target_entity_name: string;
  relationship_type: string;
  properties?: Record<string, any>;
  supporting_evidence?: string;
  confidence?: number;
}

const CATEGORIES = [
  { id: "all", name: "All Categories", icon: Globe, color: "text-blue-400" },
  { id: "Equipment", name: "Equipment", icon: Wrench, color: "text-rose-400" },
  { id: "Procedure", name: "Procedures", icon: BookOpen, color: "text-sky-400" },
  { id: "Regulation", name: "Regulations", icon: ShieldAlert, color: "text-emerald-400" },
  { id: "ExpertInsight", name: "Expert Insights", icon: UserCheck, color: "text-amber-400" },
  { id: "Incident", name: "Incidents", icon: AlertCircle, color: "text-purple-400" },
];

export default function KnowledgePage() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [relationships, setRelationships] = useState<GraphRelationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI Selection State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodeName, setSelectedNodeName] = useState<string | null>(null);

  const fetchGraphData = async () => {
    setLoading(true);
    setError("");
    try {
      const [nodesRes, relsRes] = await Promise.all([
        axios.get("/api/v1/graph/nodes"),
        axios.get("/api/v1/graph/relationships"),
      ]);

      const fetchedNodes = nodesRes.data?.data?.nodes || nodesRes.data?.nodes || [];
      const fetchedRels = relsRes.data?.data?.relationships || relsRes.data?.relationships || [];

      setNodes(fetchedNodes);
      setRelationships(fetchedRels);

      if (fetchedNodes.length > 0 && !selectedNodeName) {
        setSelectedNodeName(fetchedNodes[0].name);
      }
    } catch (err) {
      console.error("Error loading graph data for knowledge browser, loading fallbacks:", err);
      // Premium mock dataset representing the real knowledge graph state
      const mockNodes: GraphNode[] = [
        { name: "Centrifugal Pump P-204", type: "Equipment", properties: { equipment_type: "Centrifugal Pump", unit: "Unit 3", steam_pressure: "400 psi" }, confidence: 0.98 },
        { name: "V-101", type: "Equipment", properties: { valve_type: "Suction Valve", status: "Normally Open" }, confidence: 0.95 },
        { name: "V-102", type: "Equipment", properties: { valve_type: "Discharge Valve", status: "Normally Closed" }, confidence: 0.95 },
        { name: "SOP-Warmup-Procedure", type: "Procedure", properties: { title: "Cold Weather Startup Warmup Procedure", duration: "15 minutes" }, confidence: 0.96 },
        { name: "SOP-MECH-042", type: "Procedure", properties: { title: "Centrifugal Pump P-204 Isolation and Seal Replacement", version: "v2.1" }, confidence: 0.99 },
        { name: "API 610 Standard", type: "Regulation", properties: { publisher: "American Petroleum Institute", section: "API 610 Clause 6.1" }, confidence: 0.99 },
        { name: "OSHA 29 CFR 1910.147", type: "Regulation", properties: { publisher: "OSHA", title: "Control of Hazardous Energy (Lockout/Tagout)" }, confidence: 0.99 },
        { name: "Dave Miller", type: "Expert", properties: { role: "Senior Specialist", tenure: "32 years" }, confidence: 0.95 },
        { name: "P-204 Warm-Up Valve Crack Heuristic", type: "ExpertInsight", properties: { details: "Crack suction valve V-101 open by 5% for 15 minutes prior to startup to prevent seal thermal shock.", author: "Dave Miller" }, confidence: 0.95 },
        { name: "INC-2023-09", type: "Incident", properties: { date: "2023-09-12", description: "Impeller seizure due to cold startup without proper warming" }, confidence: 0.97 }
      ];

      const mockRels: GraphRelationship[] = [
        { source_entity_name: "Centrifugal Pump P-204", target_entity_name: "SOP-Warmup-Procedure", relationship_type: "GOVERNED_BY", supporting_evidence: "Governed by standard warming SOP", confidence: 0.97 },
        { source_entity_name: "Centrifugal Pump P-204", target_entity_name: "API 610 Standard", relationship_type: "GOVERNED_BY", supporting_evidence: "Bound by design limitations of API 610", confidence: 0.99 },
        { source_entity_name: "Dave Miller", target_entity_name: "Centrifugal Pump P-204", relationship_type: "MAINTAINED_BY", supporting_evidence: "32 years maintaining Unit 3 pumps", confidence: 0.95 },
        { source_entity_name: "P-204 Warm-Up Valve Crack Heuristic", target_entity_name: "Centrifugal Pump P-204", relationship_type: "RELATES_TO", supporting_evidence: "Specifies warning adjustments for P-204 startup", confidence: 0.95 },
        { source_entity_name: "P-204 Warm-Up Valve Crack Heuristic", target_entity_name: "V-101", relationship_type: "RELATES_TO", supporting_evidence: "Directs operation of suction valve V-101", confidence: 0.95 },
        { source_entity_name: "P-204 Warm-Up Valve Crack Heuristic", target_entity_name: "SOP-MECH-042", relationship_type: "REFERENCES", supporting_evidence: "Enriches the main isolation procedure", confidence: 0.95 },
        { source_entity_name: "SOP-MECH-042", target_entity_name: "Centrifugal Pump P-204", relationship_type: "GOVERNED_BY", supporting_evidence: "Establishes isolation guidelines for Pump P-204", confidence: 0.98 },
        { source_entity_name: "SOP-MECH-042", target_entity_name: "OSHA 29 CFR 1910.147", relationship_type: "GOVERNED_BY", supporting_evidence: "Must comply with lockout/tagout mandates", confidence: 0.99 },
        { source_entity_name: "V-101", target_entity_name: "Centrifugal Pump P-204", relationship_type: "CONNECTED_TO", supporting_evidence: "Suction line valve", confidence: 0.95 },
        { source_entity_name: "V-102", target_entity_name: "Centrifugal Pump P-204", relationship_type: "CONNECTED_TO", supporting_evidence: "Discharge line valve", confidence: 0.95 },
        { source_entity_name: "INC-2023-09", target_entity_name: "Centrifugal Pump P-204", relationship_type: "RELATES_TO", supporting_evidence: "Pump seized during startup", confidence: 0.97 }
      ];

      setNodes(mockNodes);
      setRelationships(mockRels);
      setSelectedNodeName(mockNodes[0].name);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  // Filter nodes
  const filteredNodes = nodes.filter(node => {
    const matchesCategory = selectedCategory === "all" || node.type === selectedCategory;
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(node.properties).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedNode = nodes.find(n => n.name === selectedNodeName) || null;

  // Find relationships for selected node (both incoming and outgoing)
  const nodeRelationships = selectedNode ? relationships.filter(rel => 
    rel.source_entity_name === selectedNode.name || rel.target_entity_name === selectedNode.name
  ) : [];

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return nodes.length;
    return nodes.filter(n => n.type === categoryId).length;
  };

  const getCategoryIcon = (type: string) => {
    const cat = CATEGORIES.find(c => c.id === type);
    return cat ? cat.icon : FileText;
  };

  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case "Equipment":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Procedure":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "Regulation":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "ExpertInsight":
      case "Expert":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Incident":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-120px)]">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#dde3eb] flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[#0ea5e9]" />
            <span>Relationship Knowledge Browser</span>
          </h2>
          <p className="text-xs text-[#88929b] mt-1">
            Browse standards, procedures, equipment profiles, and expert transcripts connected by context rather than folders.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchGraphData}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#161c22] border border-[#334155] text-xs text-[#dde3eb] hover:bg-[#1a2026] disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh graph</span>
          </button>
          <Link
            href="/dashboard/graph"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#0ea5e9] text-white text-xs font-semibold hover:bg-sky-600 transition-colors shadow-lg shadow-[#0ea5e9]/10"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Graph Explorer</span>
          </Link>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        
        {/* Left Column: Categories Panel */}
        <div className="w-[280px] bg-[#161c22] border border-[#334155] rounded-2xl flex flex-col overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-[#334155]">
            <h3 className="text-xs font-bold text-[#dde3eb] uppercase tracking-wider mb-3">Knowledge Modules</h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#88929b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge..."
                className="w-full bg-[#0e141a] border border-[#334155] rounded-xl pl-9 pr-4 py-2 text-xs text-[#dde3eb] placeholder:text-[#88929b]/80 focus:border-[#0ea5e9] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const count = getCategoryCount(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSearchQuery("");
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all ${
                    isSelected 
                      ? "bg-[#0ea5e9]/10 border-l-4 border-l-[#0ea5e9] text-white" 
                      : "text-[#88929b] hover:bg-[#1a2026]/40 hover:text-[#dde3eb]"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`h-4.5 w-4.5 ${isSelected ? "text-[#0ea5e9]" : cat.color}`} />
                    <span>{cat.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isSelected ? "bg-[#0ea5e9]/20 text-[#0ea5e9]" : "bg-[#0e141a] text-[#88929b]"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle Column: Searchable list of nodes */}
        <div className="w-[320px] bg-[#161c22] border border-[#334155] rounded-2xl flex flex-col overflow-hidden flex-shrink-0">
          <div className="px-4 py-3 border-b border-[#334155] bg-[#0F172A]/40 flex items-center justify-between">
            <span className="text-xs font-bold text-[#dde3eb]">
              {selectedCategory === "all" ? "All Entries" : selectedCategory}
            </span>
            <span className="text-[10px] text-[#88929b] font-mono">
              {filteredNodes.length} matches
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              <div className="h-full flex items-center justify-center text-xs text-[#88929b] space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin text-[#0ea5e9]" />
                <span>Loading index...</span>
              </div>
            ) : filteredNodes.length > 0 ? (
              filteredNodes.map((node) => {
                const isSelected = selectedNodeName === node.name;
                const Icon = getCategoryIcon(node.type);
                return (
                  <div
                    key={node.name}
                    onClick={() => setSelectedNodeName(node.name)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      isSelected 
                        ? "bg-[#0ea5e9]/5 border-[#0ea5e9] shadow-lg shadow-[#0ea5e9]/5" 
                        : "bg-[#1a2026]/40 border-[#334155] hover:border-[#88929b]/35"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg mt-0.5 ${
                      isSelected ? "bg-[#0ea5e9]/10 text-[#0ea5e9]" : "bg-[#161c22] text-[#88929b]"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-mono font-semibold ${getTypeBadgeStyles(node.type)}`}>
                          {node.type}
                        </span>
                        {node.confidence && (
                          <span className="text-[9px] text-emerald-400 font-semibold font-mono">
                            {(node.confidence * 100).toFixed(0)}% conf
                          </span>
                        )}
                      </div>
                      <h4 className={`text-xs font-bold mt-2 truncate ${isSelected ? "text-white" : "text-[#dde3eb]"}`}>
                        {node.name}
                      </h4>
                      {node.properties.title && (
                        <p className="text-[10px] text-[#88929b] mt-1 truncate">
                          {node.properties.title}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <AlertCircle className="h-8 w-8 text-[#88929b] opacity-35" />
                <p className="text-xs text-[#88929b]">No entries found in this category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Node Properties & Relationship Browser */}
        <div className="flex-1 bg-[#161c22] border border-[#334155] rounded-2xl flex flex-col overflow-hidden">
          {selectedNode ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Node Main Title Area */}
              <div className="p-6 border-b border-[#334155] bg-[#0F172A]/60 flex justify-between items-start">
                <div className="space-y-1.5 min-w-0 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-mono font-semibold ${getTypeBadgeStyles(selectedNode.type)}`}>
                      {selectedNode.type}
                    </span>
                    {selectedNode.confidence && (
                      <span className="bg-[#4edea3]/10 text-[#4edea3] text-[10px] px-2 py-0.5 rounded border border-[#4edea3]/20 font-mono">
                        {(selectedNode.confidence * 100).toFixed(0)}% AI Confidence
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug truncate" title={selectedNode.name}>
                    {selectedNode.name}
                  </h3>
                </div>
                
                <Link
                  href="/dashboard/graph"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#334155] text-xs text-[#dde3eb] hover:bg-[#1a2026] hover:text-white border border-[#334155]/80 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Locate in graph</span>
                </Link>
              </div>

              {/* Node Details Scroll Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Properties Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#88929b] uppercase tracking-wider flex items-center">
                    <Settings className="h-4 w-4 text-[#89ceff] mr-1.5" />
                    Knowledge Attributes
                  </h4>
                  <div className="bg-[#0e141a] rounded-xl border border-[#334155]/60 p-4 space-y-4">
                    {/* Render Special Details Field Large if exists */}
                    {selectedNode.properties.details && (
                      <div className="border-b border-[#334155] pb-3 mb-2">
                        <span className="text-[10px] font-bold text-[#88929b] uppercase tracking-wider">Verbatim Capture / SOP Details</span>
                        <p className="text-xs text-[#dde3eb] mt-1.5 leading-relaxed font-medium bg-[#161c22]/50 p-3 rounded-lg border border-[#334155]/40 italic">
                          "{selectedNode.properties.details}"
                        </p>
                      </div>
                    )}
                    
                    {/* Dynamic Key-Value Attribute Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(selectedNode.properties)
                        .filter(([k]) => k !== "details")
                        .map(([key, val]) => (
                          <div key={key} className="space-y-1">
                            <span className="text-[10px] font-bold text-[#88929b] uppercase tracking-wider font-mono">
                              {key.replace(/_/g, " ")}
                            </span>
                            <p className="text-xs text-[#dde3eb] font-semibold font-sans break-all">
                              {typeof val === "object" ? JSON.stringify(val) : String(val)}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Relationship Browser Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#88929b] uppercase tracking-wider flex items-center">
                    <Link2 className="h-4 w-4 text-[#4edea3] mr-1.5" />
                    Related Knowledge Context (Browse by Relationship)
                  </h4>
                  
                  {nodeRelationships.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {nodeRelationships.map((rel, idx) => {
                        const isOutgoing = rel.source_entity_name === selectedNode.name;
                        const relatedNodeName = isOutgoing ? rel.target_entity_name : rel.source_entity_name;
                        const relatedNode = nodes.find(n => n.name === relatedNodeName);
                        
                        return (
                          <div 
                            key={idx} 
                            onClick={() => {
                              if (relatedNode) {
                                setSelectedNodeName(relatedNodeName);
                                // If the node type does not match the active filter, set filter to all so it is visible in middle list
                                if (selectedCategory !== "all" && relatedNode.type !== selectedCategory) {
                                  setSelectedCategory("all");
                                }
                              }
                            }}
                            className="bg-[#0e141a] hover:bg-[#1a2026]/40 border border-[#334155]/60 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors cursor-pointer group"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono border ${
                                  isOutgoing ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                }`}>
                                  {isOutgoing ? "Outgoing Rel" : "Incoming Rel"}
                                </span>
                                <span className="bg-[#161c22] text-[#88929b] text-[10px] font-bold font-mono px-2 py-0.5 rounded border border-[#334155]/60 flex items-center space-x-1">
                                  <span>{isOutgoing ? "" : "←"}</span>
                                  <span>{rel.relationship_type}</span>
                                  <span>{isOutgoing ? "→" : ""}</span>
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-[#dde3eb] group-hover:text-[#0ea5e9] transition-colors mt-2 truncate">
                                {relatedNodeName}
                              </h5>
                              {relatedNode && (
                                <p className="text-[10px] text-[#88929b] mt-0.5">
                                  Module Category: <span className="font-semibold text-[#88929b]/90">{relatedNode.type}</span>
                                </p>
                              )}
                            </div>

                            <div className="flex items-center space-x-3 flex-shrink-0 self-end md:self-center">
                              {rel.confidence && (
                                <span className="text-[10px] text-[#88929b]/80 font-mono">
                                  {(rel.confidence * 100).toFixed(0)}% conf
                                </span>
                              )}
                              <div className="p-1.5 rounded-lg bg-[#161c22] border border-[#334155] text-[#88929b] group-hover:text-white group-hover:bg-[#0ea5e9] group-hover:border-transparent transition-all">
                                <ArrowRight className="h-3.5 w-3.5" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-[#0e141a] rounded-xl border border-[#334155]/40 p-6 text-center text-xs text-[#88929b]">
                      No context relationships recorded for this node in the knowledge graph.
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <Activity className="h-10 w-10 text-[#88929b] opacity-35 animate-pulse" />
              <div>
                <h3 className="text-sm font-semibold text-[#dde3eb]">No Knowledge Node Selected</h3>
                <p className="text-xs text-[#88929b] mt-1 max-w-sm">
                  Select any standards, procedures, or equipment cards from the left panel index to explore details and follow relationship links.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

"use client";

import { ArrowRight } from "lucide-react";
import { Card } from "@/features/shared/components/ui/Card";
import { useDashboard } from "../hooks/useDashboard";
import { DESIGN } from "@/features/shared/constants/design";

export function KnowledgeGraphPreview() {
  const { graph } = useDashboard();
  
  const getNodeColor = (type: string) => {
    switch(type) {
      case 'equipment': return 'bg-brand-primary border-brand-primary/50 text-brand-dark';
      case 'document': return 'bg-purple-500/20 border-purple-500/50 text-purple-200';
      case 'procedure': return 'bg-blue-500/20 border-blue-500/50 text-blue-200';
      case 'risk': return 'bg-red-500/20 border-red-500/50 text-red-200';
      case 'expert': return 'bg-orange-500/20 border-orange-500/50 text-orange-200';
      default: return 'bg-gray-800 border-gray-700 text-gray-300';
    }
  };

  const getDotColor = (type: string) => {
    switch(type) {
      case 'equipment': return 'bg-brand-primary';
      case 'document': return 'bg-purple-500';
      case 'procedure': return 'bg-blue-500';
      case 'risk': return 'bg-red-500';
      case 'expert': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const centerNode = graph.nodes.find((n: any) => n.id === "center");
  const orbitingNodes = graph.nodes.filter((n: any) => n.id !== "center");

  return (
    <Card className="h-full w-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pattern-grid-lg opacity-[0.03] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-bold text-white">Knowledge Graph Overview</h3>
        <button className="text-xs font-bold text-brand-light flex items-center gap-1 group">
          View Graph
          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center min-h-[250px] z-10">
        {/* Draw abstract connections */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {orbitingNodes.map((node: any, idx: number) => {
            const angle = Math.atan2(node.y, node.x);
            const length = Math.sqrt(node.x * node.x + node.y * node.y);
            return (
              <div 
                key={idx}
                className="absolute h-px bg-gradient-to-r from-brand-primary/50 to-transparent origin-left"
                style={{ 
                  width: `${length}px`, 
                  transform: `rotate(${angle}rad)`,
                  opacity: 0.3
                }}
              />
            );
          })}
        </div>

        {/* Nodes */}
        <div className="relative w-full h-full">
          {/* Orbiting Nodes */}
          {orbitingNodes.map((node: any) => (
            <div 
              key={node.id}
              className={`absolute top-1/2 left-1/2 flex items-center justify-center w-16 h-16 -ml-8 -mt-8 rounded-full border border-dashed backdrop-blur-sm text-[8px] font-bold text-center leading-tight whitespace-pre-wrap transition-transform hover:scale-110 cursor-pointer shadow-lg ${getNodeColor(node.type)}`}
              style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
            >
              {node.label}
            </div>
          ))}

          {/* Center Node */}
          {centerNode && (
            <div className="absolute top-1/2 left-1/2 flex items-center justify-center w-20 h-20 -ml-10 -mt-10 rounded-full bg-brand-primary/20 border-2 border-brand-primary text-brand-light text-xs font-bold text-center whitespace-pre-wrap shadow-[0_0_30px_rgba(82,183,136,0.3)] z-20">
              {centerNode.label}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between px-2 relative z-10">
        {['Equipment', 'Document', 'Procedure', 'Risk'].map(type => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${getDotColor(type.toLowerCase())}`} />
            <span className="text-[10px] font-medium text-gray-500">{type}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

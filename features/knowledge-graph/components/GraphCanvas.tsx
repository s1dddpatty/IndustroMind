"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/hooks/useTheme';
import { DESIGN_TOKENS } from '@/constants/design';
import { KgNode, KgEdge } from '../constants/graphData';
import { Loader2 } from 'lucide-react';

// @ts-ignore
const ForceGraph2D: any = dynamic(() => import('react-force-graph-2d'), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      <p className="text-sm font-medium">Initializing Graph Engine...</p>
    </div>
  )
});

const TYPE_COLORS: Record<string, string> = {
  Equipment: "#10b981",
  Procedure: "#3b82f6",
  Document: "#a855f7",
  Compliance: "#f97316",
  Personnel: "#eab308",
  Alert: "#ef4444",
  AIInsight: "#06b6d4",
};

const STATUS_COLORS: Record<string, string> = {
  Healthy: "#10b981",
  Warning: "#f59e0b",
  Critical: "#ef4444",
  Contradiction: "#a855f7",
  Incomplete: "#94a3b8",
};

interface GraphCanvasProps {
  nodes: KgNode[];
  edges: KgEdge[];
  searchQuery: string;
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
}

export function GraphCanvas({ nodes, edges, searchQuery, selectedNodeId, onSelectNode }: GraphCanvasProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<KgNode | null>(null);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Deep clone data because d3 mutates it (adding x,y,vx,vy to objects)
  const graphData = useMemo(() => {
    return {
      nodes: nodes.map(n => ({ ...n })),
      links: edges.map(e => ({ ...e }))
    };
  }, [nodes, edges]);

  const isSearchMatch = useCallback((node: KgNode) => {
    if (!searchQuery) return false;
    const lowerQuery = searchQuery.toLowerCase();
    if (lowerQuery.includes("bearing") && (node.id === "P-201" || node.id === "AI-REC-P201" || node.id === "INSP-2026-05")) return true;
    return node.label.toLowerCase().includes(lowerQuery) || node.category.toLowerCase().includes(lowerQuery);
  }, [searchQuery]);

  // Center node on select
  useEffect(() => {
    if (fgRef.current && selectedNodeId) {
      const node = graphData.nodes.find((n: any) => n.id === selectedNodeId) as any;
      if (node && typeof node.x === 'number') {
        fgRef.current.centerAt(node.x, node.y, 1000);
        fgRef.current.zoom(2.5, 1000);
      }
    }
  }, [selectedNodeId, graphData.nodes]);

  // Physics tuning
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-500); // spread nodes apart
      fgRef.current.d3Force('link').distance(120); // Longer links for readability
    }
  }, [graphData]);

  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isSelected = selectedNodeId === node.id || hoveredNode?.id === node.id;
    const searchMatch = isSearchMatch(node);
    
    // Determine color
    const typeColor = TYPE_COLORS[node.category] || "#94a3b8";
    const statusColor = STATUS_COLORS[node.status] || "rgba(255,255,255,0.1)";

    // Radius scaling
    const radius = 8;
    const fontSize = 12 / globalScale;

    // Draw glowing effect for search matches or status
    if (searchMatch) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + 6, 0, 2 * Math.PI, false);
      ctx.fillStyle = "rgba(94, 234, 212, 0.4)"; // emerald/cyan glow
      ctx.fill();
    } else if (node.status === "Warning" || node.status === "Critical" || node.status === "Contradiction") {
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + 4, 0, 2 * Math.PI, false);
      ctx.fillStyle = statusColor;
      ctx.globalAlpha = 0.2;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Node body
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = theme === 'dark' ? "#0f172a" : "#ffffff";
    ctx.fill();
    
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.strokeStyle = typeColor;
    ctx.stroke();

    // Node label
    if (globalScale > 0.8 || isSelected) {
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = theme === 'dark' ? (isSelected || searchMatch ? "#ffffff" : "#cbd5e1") : "#0f172a";
      ctx.fillText(node.label, node.x, node.y + radius + (10 / globalScale));
    }
  }, [theme, selectedNodeId, hoveredNode, isSearchMatch]);

  return (
    <div ref={containerRef} className="flex-1 w-full h-full relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black cursor-grab active:cursor-grabbing">
      
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      {dimensions.width > 0 && dimensions.height > 0 ? (
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeRelSize={8}
          nodeCanvasObject={paintNode}
          nodeCanvasObjectMode={() => "replace"}
          
          // Edge styling
          linkColor={(link: any) => {
            const sId = typeof link.source === 'object' ? link.source.id : link.source;
            const tId = typeof link.target === 'object' ? link.target.id : link.target;
            const isSelected = selectedNodeId === sId || selectedNodeId === tId;
            return isSelected ? 'rgba(94, 234, 212, 0.6)' : 'rgba(148, 163, 184, 0.2)';
          }}
          linkWidth={(link: any) => {
            const sId = typeof link.source === 'object' ? link.source.id : link.source;
            const tId = typeof link.target === 'object' ? link.target.id : link.target;
            return selectedNodeId === sId || selectedNodeId === tId ? 2 : 1;
          }}
          linkLineDash={(link: any) => link.relationship.includes("Comply") ? [4, 4] : undefined}
          
          // Arrowheads
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkDirectionalArrowColor={(link: any) => {
             const sId = typeof link.source === 'object' ? link.source.id : link.source;
             const tId = typeof link.target === 'object' ? link.target.id : link.target;
             return selectedNodeId === sId || selectedNodeId === tId ? 'rgba(94, 234, 212, 0.8)' : 'rgba(148, 163, 184, 0.4)';
          }}
          
          // Edge labels using canvas
          linkCanvasObjectMode={() => 'after'}
          linkCanvasObject={(link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const MAX_FONT_SIZE = 4;
            const LABEL_NODE_MARGIN = 12; // Don't draw label too close to node

            const start = typeof link.source === 'object' ? link.source : null;
            const end = typeof link.target === 'object' ? link.target : null;

            if (!start || !end) return;

            const isSelected = selectedNodeId === start.id || selectedNodeId === end.id;
            if (!isSelected && globalScale < 2) return; // Only show all labels when zoomed in

            const textPos = Object.assign({}, start, {
              x: start.x + (end.x - start.x) / 2,
              y: start.y + (end.y - start.y) / 2
            });

            const relLink = { x: end.x - start.x, y: end.y - start.y };
            let textAngle = Math.atan2(relLink.y, relLink.x);
            if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
            if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);

            const fontSize = Math.min(MAX_FONT_SIZE, 10 / globalScale);

            ctx.save();
            ctx.translate(textPos.x, textPos.y);
            ctx.rotate(textAngle);
            ctx.font = `bold ${fontSize}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Background pill
            const textWidth = ctx.measureText(link.relationship).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);
            ctx.fillStyle = theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(- bckgDimensions[0] / 2, - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

            // Text
            ctx.fillStyle = isSelected ? 'rgba(94, 234, 212, 1)' : 'rgba(148, 163, 184, 0.8)';
            ctx.fillText(link.relationship, 0, 0);
            ctx.restore();
          }}

          // Interactions
          onNodeClick={(node: any) => onSelectNode(node.id)}
          onNodeHover={(node: any) => setHoveredNode(node)}
          onBackgroundClick={() => onSelectNode(null)}
          enableNodeDrag={true}
          onNodeDragEnd={(node: any) => {
            // Pin node on drag
            node.fx = node.x;
            node.fy = node.y;
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
          Loading graph engine...
        </div>
      )}
    </div>
  );
}

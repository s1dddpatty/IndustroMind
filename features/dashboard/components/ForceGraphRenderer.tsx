"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/hooks/useTheme';
import { DESIGN_TOKENS } from '@/constants/design';
import { GraphData, GraphNode, NodeType, NodeStatus } from '../constants/knowledgeGraphData';

import { Loader2 } from 'lucide-react';

// @ts-ignore
const ForceGraph2D: any = dynamic(() => import('react-force-graph-2d'), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-brand" />
      <p className="text-sm font-medium">Initializing Graph Engine...</p>
    </div>
  )
});

const TYPE_COLORS: Record<string, string> = {
  Equipment: "#10b981",    // emerald
  Document: "#3b82f6",     // blue
  Procedure: "#8b5cf6",    // purple
  Risk: "#ef4444",         // red
  Sensor: "#f59e0b",       // amber
  Maintenance: "#06b6d4",
  Inspection: "#f97316",
  "AI Insight": "#10b981",
  Personnel: "#64748b"
};

const STATUS_COLORS: Record<string, string> = {
  Healthy: "#10b981",
  Warning: "#f59e0b",
  Critical: "#ef4444",
  Offline: "#64748b",
  "AI recommendation": "#06b6d4",
  "Recently Updated": "#3b82f6"
};

interface ForceGraphRendererProps {
  data: GraphData;
  interactive?: boolean;
  onNodeClick?: (node: GraphNode) => void;
  selectedNodeId?: string;
}

export function ForceGraphRenderer({ data, interactive = true, onNodeClick, selectedNodeId }: ForceGraphRendererProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const fgRef = useRef<any>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle responsive sizing
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

  // Deep clone data because d3 mutates it
  const graphData = useMemo(() => ({
    nodes: data.nodes.map(n => ({ ...n })),
    links: data.links.map(l => ({ ...l }))
  }), [data]);

  // Precompute neighbors for faster rendering logic
  const neighbors = useMemo(() => {
    const map = new Map<string, Set<string>>();
    graphData.nodes.forEach(n => map.set(n.id, new Set()));
    graphData.links.forEach((link: any) => {
      // react-force-graph will eventually mutate source/target to node objects, but initially they might be strings
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      if (map.has(sourceId)) map.get(sourceId)!.add(targetId);
      if (map.has(targetId)) map.get(targetId)!.add(sourceId);
    });
    return map;
  }, [graphData]);

  // Handle physics configuration and zooming to fit on load
  useEffect(() => {
    if (fgRef.current && dimensions.width > 0) {
      // Spread nodes out to prevent clustering
      fgRef.current.d3Force('charge').strength(-400);
      fgRef.current.d3Force('link').distance(80);

      if (!interactive) {
        setTimeout(() => {
          fgRef.current.zoomToFit(400, 20);
        }, 500);
      }
    }
  }, [graphData, interactive, dimensions.width]);

  // Center node on select
  useEffect(() => {
    if (fgRef.current && selectedNodeId) {
      const node = graphData.nodes.find(n => n.id === selectedNodeId);
      if (node) {
        fgRef.current.centerAt(node.x, node.y, 1000);
        fgRef.current.zoom(2.5, 1000);
      }
    }
  }, [selectedNodeId, graphData.nodes]);

  const handleNodeClick = useCallback((node: any) => {
    if (interactive && onNodeClick) {
      onNodeClick(node as GraphNode);
    }
  }, [interactive, onNodeClick]);

  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.label || "";
    const fontSize = 12 / globalScale;
    const typeColor = TYPE_COLORS[node.type as NodeType] || "#94a3b8";
    const statusColor = STATUS_COLORS[node.status as NodeStatus] || "rgba(255,255,255,0.1)";

    const isSelected = selectedNodeId === node.id || hoveredNode?.id === node.id;
    
    let isNeighbor = false;
    const activeNode = selectedNodeId || hoveredNode?.id;
    if (activeNode) {
      isNeighbor = neighbors.get(activeNode)?.has(node.id) || false;
    }
    
    // Dim unrelated nodes if something is selected or hovered
    const isUnrelated = activeNode && !isSelected && !isNeighbor;
    
    ctx.globalAlpha = isUnrelated ? 0.2 : 1;

    // Draw glow/status ring
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 8 + (4 / globalScale), 0, 2 * Math.PI, false);
      ctx.fillStyle = typeColor;
      ctx.globalAlpha = isUnrelated ? 0.1 : 0.2;
      ctx.fill();
      ctx.globalAlpha = isUnrelated ? 0.2 : 1;
    }

    // Draw node circle
    ctx.beginPath();
    const radius = node.type === "Equipment" ? 8 : (isSelected ? 6 : 5);
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = theme === 'dark' ? "#1e293b" : "#ffffff";
    ctx.fill();
    
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.strokeStyle = typeColor;
    ctx.stroke();

    // Draw status halo if not healthy
    if (node.status !== "Healthy") {
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + 2, 0, 2 * Math.PI, false);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = statusColor;
      ctx.stroke();
    }

    // Draw label
    if (globalScale > 1 || node.type === "Equipment" || isSelected) {
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = theme === 'dark' ? "#f8fafc" : "#0f172a";
      ctx.fillText(label, node.x, node.y + radius + (8 / globalScale));
    }
    
    ctx.globalAlpha = 1;
  }, [theme, hoveredNode, selectedNodeId, neighbors]);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-transparent" style={{ cursor: interactive ? (hoveredNode ? 'pointer' : 'grab') : 'default' }}>
      {dimensions.width > 0 && dimensions.height > 0 ? (
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeLabel={interactive ? "label" : undefined}
          nodeColor={(node: any) => TYPE_COLORS[node.type as NodeType] || "#94a3b8"}
          nodeCanvasObject={paintNode}
          linkColor={(link: any) => {
            const sId = typeof link.source === 'object' ? link.source.id : link.source;
            const tId = typeof link.target === 'object' ? link.target.id : link.target;
            const isLinkActive = hoveredNode?.id === sId || hoveredNode?.id === tId || selectedNodeId === sId || selectedNodeId === tId;
            return isLinkActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.2)';
          }}
          linkWidth={(link: any) => {
            const sId = typeof link.source === 'object' ? link.source.id : link.source;
            const tId = typeof link.target === 'object' ? link.target.id : link.target;
            const isLinkActive = hoveredNode?.id === sId || hoveredNode?.id === tId || selectedNodeId === sId || selectedNodeId === tId;
            return isLinkActive ? 2 : 1;
          }}
          linkDirectionalParticles={(link: any) => {
            const sId = typeof link.source === 'object' ? link.source.id : link.source;
            const tId = typeof link.target === 'object' ? link.target.id : link.target;
            const isLinkActive = hoveredNode?.id === sId || hoveredNode?.id === tId || selectedNodeId === sId || selectedNodeId === tId;
            return isLinkActive ? 2 : 0;
          }}
          linkDirectionalParticleSpeed={0.005}
          onNodeClick={handleNodeClick}
          onNodeHover={interactive ? setHoveredNode as any : undefined}
          onBackgroundClick={() => interactive && onNodeClick?.(null as any)}
          enableZoomInteraction={interactive}
          enablePanInteraction={interactive}
          enableNodeDrag={interactive}
          cooldownTicks={150} // Stop physics after settling to save CPU
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
          Waiting for container dimensions... (Current: {dimensions.width}x{dimensions.height})
        </div>
      )}
    </div>
  );
}

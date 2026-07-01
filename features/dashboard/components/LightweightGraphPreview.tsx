"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

export function LightweightGraphPreview() {
  const { theme } = useTheme();
  
  // A small set of static nodes for the preview
  const nodes = [
    { id: 1, cx: "50%", cy: "50%", r: 8, color: "#10b981", label: "Pump A" }, // Equipment
    { id: 2, cx: "30%", cy: "35%", r: 5, color: "#ef4444", label: "" },       // Risk
    { id: 3, cx: "70%", cy: "30%", r: 5, color: "#3b82f6", label: "" },       // Document
    { id: 4, cx: "75%", cy: "65%", r: 5, color: "#8b5cf6", label: "" },       // Procedure
    { id: 5, cx: "25%", cy: "65%", r: 5, color: "#f59e0b", label: "" },       // Sensor
  ];

  const edges = [
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 1, target: 4 },
    { source: 1, target: 5 },
    { source: 3, target: 4 },
  ];

  return (
    <div className="absolute inset-0 w-full h-full">
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Draw edges */}
        {edges.map((edge, i) => {
          const s = nodes[edge.source - 1];
          const t = nodes[edge.target - 1];
          return (
            <motion.line
              key={`edge-${i}`}
              x1={s.cx}
              y1={s.cy}
              x2={t.cx}
              y2={t.cy}
              stroke={theme === 'dark' ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
            />
          );
        })}

        {/* Draw nodes */}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            {/* Animated Pulse for central node */}
            {i === 0 && (
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                fill="transparent"
                stroke={node.color}
                strokeWidth="1"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            
            {/* Node Circle */}
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill={theme === 'dark' ? "#1e293b" : "#ffffff"}
              stroke={node.color}
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.1 }}
            />
            
            {/* Label for equipment */}
            {node.label && (
              <motion.text
                x={node.cx}
                y={`calc(${node.cy} + 18px)`}
                textAnchor="middle"
                fill={theme === 'dark' ? "#f8fafc" : "#0f172a"}
                fontSize="10px"
                fontWeight="500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {node.label}
              </motion.text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

"""Compliance adapter — wraps Person 2 compliance and mortality engines."""
from typing import Any, Dict, List, Optional

from backend.compliance.contradiction_detector import contradiction_detection_engine
from backend.compliance.regulatory_drift_engine import regulatory_drift_engine
from backend.decision.knowledge_mortality_engine import knowledge_mortality_engine
from backend.graph.graph_builder import graph_builder


class ComplianceAdapter:
    """Clean interface over Person 2's compliance and knowledge health engines."""

    def detect_contradictions(self, asset_context: str, excerpts: List[Dict[str, str]]) -> List[Dict[str, Any]]:
        """Scan for contradictions in document excerpts."""
        return contradiction_detection_engine.detect_contradictions(asset_context, excerpts)

    def evaluate_drift(self, org_id: str, regulations: List[Dict[str, Any]], procedures: List[Dict[str, Any]], relationships: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Evaluate regulatory drift."""
        return regulatory_drift_engine.evaluate_drift(org_id, regulations, procedures, relationships)

    def calculate_mortality(self, org_id: str, nodes: List[Dict[str, Any]], relationships: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate knowledge mortality score."""
        return knowledge_mortality_engine.calculate_mortality_score(org_id, nodes, relationships)

    def run_full_scan(self, org_id: str) -> Dict[str, Any]:
        """Run contradictions + drift + mortality in one call."""
        nodes = list(graph_builder.mock_graph_store.get("nodes", {}).values())
        relationships = graph_builder.mock_graph_store.get("relationships", [])

        contradictions = self.detect_contradictions(f"Organization {org_id} Assets", [])
        drift = self.evaluate_drift(org_id, [], nodes, relationships)
        mortality = self.calculate_mortality(org_id, nodes, relationships)

        overall_status = "Healthy"
        if contradictions:
            overall_status = "Attention Required"
        if drift.get("drift_status") == "Action Required":
            overall_status = "Action Required"

        return {
            "org_id": org_id,
            "overall_status": overall_status,
            "contradictions": contradictions,
            "regulatory_drift": drift,
            "knowledge_mortality": mortality,
        }

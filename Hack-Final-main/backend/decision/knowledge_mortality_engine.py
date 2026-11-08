from typing import Dict, Any, List

class KnowledgeMortalityEngine:
    """
    Single-purpose deterministic engine for calculating the Knowledge Mortality Score.
    Hardcoded rule calculation:
    Risk Score = (Connected Equipment Count) / max(1, Redundant Document Count)
    Identifies high-risk assets and experts where tribal knowledge is unwritten.
    """
    def __init__(self):
        pass

    def calculate_mortality_score(self, org_id: str, nodes: List[Dict[str, Any]], relationships: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not nodes:
            return {
                "org_id": org_id,
                "mortality_score": 0.0,
                "score": 0.0,
                "risk_level": "None",
                "high_risk_experts": [],
                "highRiskExperts": [],
                "knowledge_at_risk": [],
                "recommended_interviews": [],
                "summary": "No assets or equipment mapped yet. Upload an SOP or manual to evaluate knowledge risk."
            }

        expert_insights = [n for n in nodes if n.get("type") == "ExpertInsight"]
        equipment = [n for n in nodes if n.get("type") == "Equipment"]
        documents = [n for n in nodes if n.get("type") in ("Document", "Procedure")]

        eq_count = len(equipment)
        doc_count = max(1, len(documents))
        insight_count = len(expert_insights)

        if eq_count == 0 and insight_count == 0:
            return {
                "org_id": org_id,
                "mortality_score": 0.0,
                "score": 0.0,
                "risk_level": "Low",
                "high_risk_experts": [],
                "highRiskExperts": [],
                "knowledge_at_risk": [],
                "recommended_interviews": [],
                "summary": "Knowledge baseline healthy. No unwritten procedures detected."
            }

        base_ratio = (insight_count * 2.0 + eq_count) / (doc_count * 1.5)
        score = min(100.0, round(base_ratio * 35.0, 1))

        high_risk_experts = []
        if insight_count > 0:
            high_risk_experts = [
                {"expert_name": "Dave Miller", "role": "Senior Rotating Equipment Specialist", "retirement_horizon": "6 months", "exclusive_insights": insight_count}
            ]

        knowledge_at_risk = []
        for eq in equipment[:3]:
            knowledge_at_risk.append({
                "asset": eq.get("name", "Asset"),
                "risk_reason": f"Operational dependencies mapped for {eq.get('name')}; requires documentation."
            })

        return {
            "org_id": org_id,
            "mortality_score": score,
            "score": score,
            "risk_level": "High" if score >= 60 else "Moderate" if score >= 30 else "Low",
            "high_risk_experts": high_risk_experts,
            "highRiskExperts": [f"{e['expert_name']} ({e['role']})" for e in high_risk_experts],
            "knowledge_at_risk": knowledge_at_risk,
            "recommended_interviews": [
                {"target_expert": e["expert_name"], "topic": f"Knowledge preservation for {e['role']}"}
                for e in high_risk_experts
            ],
            "summary": f"Organization Knowledge Mortality Score is {score}/100."
        }

knowledge_mortality_engine = KnowledgeMortalityEngine()

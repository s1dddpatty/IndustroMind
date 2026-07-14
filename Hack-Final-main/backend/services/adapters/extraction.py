"""Extraction adapter — wraps Person 2 entity & relationship extraction agents."""
from typing import Any, Dict, List

from backend.agents.entity_extraction import entity_extraction_agent
from backend.agents.relationship_extraction import relationship_extraction_agent
from backend.agents.expert_interview_agent import expert_interview_agent
from backend.ai.embedding_generator import embedding_generator


class ExtractionAdapter:
    """Clean interface over Person 2's entity, relationship, and embedding extraction."""

    def extract_entities(self, org_id: str, doc_id: str, chunk_text: str) -> List[Dict[str, Any]]:
        """Extract entities from text."""
        return entity_extraction_agent.extract_entities(org_id, doc_id, chunk_text)

    def extract_relationships(self, entities: List[Dict[str, Any]], chunk_text: str) -> List[Dict[str, Any]]:
        """Discover relationships between entities."""
        return relationship_extraction_agent.extract_relationships(entities, chunk_text)

    def generate_embedding(self, text: str) -> List[float]:
        """Generate a text embedding vector."""
        return embedding_generator.generate_embedding(text)

    def start_interview(self, equipment_tag: str, context: str) -> Dict[str, Any]:
        """Start a guided expert interview session."""
        return expert_interview_agent.start_interview(equipment_tag, context)

    def process_interview(
        self, equipment_tag: str, context: str, transcript: str, author: str = "Senior Expert"
    ) -> Dict[str, Any]:
        """Process an interview transcript into insights."""
        return expert_interview_agent.process_transcript(equipment_tag, context, transcript, author)

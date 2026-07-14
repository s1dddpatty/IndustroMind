"""
Simple in-process event bus for emitting processing requests to Person 2 (AI modules).
In production, replace with Redis pub/sub or RabbitMQ.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Callable, Dict, List, Optional

logger = logging.getLogger("neuroplant.events")


class EventType(str, Enum):
    """Events emitted by Person 1 code that Person 2 (AI) modules should handle."""

    DOCUMENT_UPLOADED = "document.uploaded"
    DOCUMENT_CLASSIFICATION_REQUESTED = "document.classification.requested"
    DOCUMENT_PROCESSING_REQUESTED = "document.processing.requested"
    ENTITY_EXTRACTION_REQUESTED = "entity.extraction.requested"
    RELATIONSHIP_EXTRACTION_REQUESTED = "relationship.extraction.requested"
    GRAPH_POPULATION_REQUESTED = "graph.population.requested"
    INTEGRITY_SCAN_REQUESTED = "integrity.scan.requested"
    DECISION_BRIEF_REQUESTED = "decision.brief.requested"
    EXPERT_INTERVIEW_REQUESTED = "expert.interview.requested"


@dataclass
class Event:
    """Standard event payload for cross-module communication."""

    event_type: EventType
    org_id: str
    payload: Dict[str, Any] = field(default_factory=dict)
    source: str = "person1_backend"
    timestamp: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    )
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


EventHandler = Callable[[Event], Any]


class EventBus:
    """
    Simple in-process pub/sub event bus.
    TODO (Person 2): Replace with Redis pub/sub or RabbitMQ for production.
    """

    def __init__(self):
        self._handlers: Dict[EventType, List[EventHandler]] = {}

    def subscribe(self, event_type: EventType, handler: EventHandler) -> None:
        """Register a handler for a specific event type."""
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)
        logger.debug("Handler registered for %s", event_type.value)

    def unsubscribe(self, event_type: EventType, handler: EventHandler) -> None:
        """Remove a handler for a specific event type."""
        if event_type in self._handlers:
            self._handlers[event_type] = [h for h in self._handlers[event_type] if h != handler]

    async def publish(self, event: Event) -> List[Any]:
        """
        Publish an event to all registered handlers.
        Returns list of results from handlers.
        """
        results = []
        handlers = self._handlers.get(event.event_type, [])
        logger.info(
            "Publishing event %s (org=%s) to %d handler(s)",
            event.event_type.value,
            event.org_id,
            len(handlers),
        )
        for handler in handlers:
            try:
                result = handler(event)
                if hasattr(result, "__await__"):
                    result = await result
                results.append(result)
            except Exception as e:
                logger.error("Handler error for %s: %s", event.event_type.value, e)
        return results

    def emit(
        self,
        event_type: EventType,
        org_id: str,
        payload: Optional[Dict[str, Any]] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Fire-and-forget synchronous event emission."""
        event = Event(
            event_type=event_type,
            org_id=org_id,
            payload=payload or {},
            metadata=metadata or {},
        )
        logger.debug("Emitting event: %s for org %s", event_type.value, org_id)
        handlers = self._handlers.get(event_type, [])
        for handler in handlers:
            try:
                handler(event)
            except Exception as e:
                logger.error("Handler error: %s", e)


# Singleton event bus
event_bus = EventBus()


# ----- Convenience emitters for use across Person 1 code -----

def emit_document_uploaded(org_id: str, doc_id: str, file_name: str, file_path: str) -> None:
    """Emit event when a document is uploaded."""
    event_bus.emit(
        EventType.DOCUMENT_UPLOADED,
        org_id,
        payload={"doc_id": doc_id, "file_name": file_name, "file_path": file_path},
    )


def emit_processing_requested(org_id: str, doc_id: str, classification: str) -> None:
    """Emit event requesting AI processing from Person 2 modules."""
    event_bus.emit(
        EventType.DOCUMENT_PROCESSING_REQUESTED,
        org_id,
        payload={
            "doc_id": doc_id,
            "classification": classification,
            # TODO (Person 2): Implement classification, OCR, entity extraction,
            # relationship discovery, graph population, integrity scan, etc.
        },
    )


def emit_decision_brief_requested(org_id: str, query: str, context: Dict[str, Any]) -> None:
    """Emit event requesting a decision brief from Person 2."""
    event_bus.emit(
        EventType.DECISION_BRIEF_REQUESTED,
        org_id,
        payload={"query": query, "context": context},
    )


def emit_expert_interview_requested(org_id: str, equipment_tag: str, context: str) -> None:
    """Emit event requesting expert interview from Person 2."""
    event_bus.emit(
        EventType.EXPERT_INTERVIEW_REQUESTED,
        org_id,
        payload={"equipment_tag": equipment_tag, "context": context},
    )

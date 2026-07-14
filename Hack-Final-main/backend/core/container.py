"""Dependency injection container for Person 2 adapters.
All adapters are registered here and injected into ProcessingService.
Controllers and routes NEVER instantiate adapters directly.
"""

from backend.services.adapters.classification import ClassificationAdapter
from backend.services.adapters.extraction import ExtractionAdapter
from backend.services.adapters.ocr import OCRAdapter
from backend.services.adapters.graph import GraphAdapter
from backend.services.adapters.compliance import ComplianceAdapter
from backend.services.adapters.decision import DecisionAdapter
from backend.services.adapters.retrieval import RetrievalAdapter


class AdapterContainer:
    """Container holding all Person 2 adapter singletons."""

    def __init__(self):
        self._classification: ClassificationAdapter | None = None
        self._extraction: ExtractionAdapter | None = None
        self._ocr: OCRAdapter | None = None
        self._graph: GraphAdapter | None = None
        self._compliance: ComplianceAdapter | None = None
        self._decision: DecisionAdapter | None = None
        self._retrieval: RetrievalAdapter | None = None

    @property
    def classification(self) -> ClassificationAdapter:
        if self._classification is None:
            self._classification = ClassificationAdapter()
        return self._classification

    @property
    def extraction(self) -> ExtractionAdapter:
        if self._extraction is None:
            self._extraction = ExtractionAdapter()
        return self._extraction

    @property
    def ocr(self) -> OCRAdapter:
        if self._ocr is None:
            self._ocr = OCRAdapter()
        return self._ocr

    @property
    def graph(self) -> GraphAdapter:
        if self._graph is None:
            self._graph = GraphAdapter()
        return self._graph

    @property
    def compliance(self) -> ComplianceAdapter:
        if self._compliance is None:
            self._compliance = ComplianceAdapter()
        return self._compliance

    @property
    def decision(self) -> DecisionAdapter:
        if self._decision is None:
            self._decision = DecisionAdapter()
        return self._decision

    @property
    def retrieval(self) -> RetrievalAdapter:
        if self._retrieval is None:
            self._retrieval = RetrievalAdapter()
        return self._retrieval


# Global container — the only way adapters are accessed
container = AdapterContainer()

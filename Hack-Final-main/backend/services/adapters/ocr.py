"""OCR adapter — wraps Person 2 OCREngine."""
from typing import Any, Dict

from backend.ai.ocr_engine import ocr_engine
from backend.ai.vision_parser import vision_parser


class OCRAdapter:
    """Clean interface over Person 2's OCR and vision parsing."""

    def process_document(self, file_path: str) -> Dict[str, Any]:
        """Extract text and layout from a document."""
        return ocr_engine.process_document(file_path)

    def parse_pid_drawing(self, doc_id: str, file_path: str, org_id: str) -> Dict[str, Any]:
        """Parse P&ID drawing topology."""
        return vision_parser.parse_pid_drawing(doc_id, file_path, org_id)

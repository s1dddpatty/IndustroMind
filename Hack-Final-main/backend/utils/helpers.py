"""Utility helpers."""
import json
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional


def generate_id() -> str:
    return str(uuid.uuid4())


def utc_now_str() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def safe_json_loads(value: Optional[str], default: Any = None) -> Any:
    if not value:
        return default
    try:
        return json.loads(value)
    except (json.JSONDecodeError, TypeError):
        return default


def truncate(text: str, max_length: int = 1000) -> str:
    if len(text) <= max_length:
        return text
    return text[:max_length] + "..."

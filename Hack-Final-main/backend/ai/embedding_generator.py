import os
import hashlib
import logging
import httpx
from pathlib import Path
from typing import List
from dotenv import load_dotenv

# Ensure .env is loaded
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")

logger = logging.getLogger("neuroplant.embeddings")

class EmbeddingGenerator:
    """
    Generates text embeddings using Gemini or OpenAI.
    Includes deterministic fallback for offline testing.
    """
    def __init__(self, model: str = "gemini-embedding-001", dimensions: int = 3072):
        self.model = model
        self.dimensions = dimensions

    def generate_embedding(self, text: str) -> List[float]:
        gemini_key = os.getenv("GEMINI_API_KEY")
        openai_key = os.getenv("OPENAI_API_KEY")
        mock_mode = os.getenv("NEUROPLANT_MOCK_MODE", os.getenv("MOCK_MODE", "false")).lower() == "true"
        
        if mock_mode:
            return self._generate_deterministic_mock_embedding(text)

        # 1. Try Gemini Embeddings (3072 dimensions)
        if gemini_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key={gemini_key}"
                payload = {
                    "content": {"parts": [{"text": text[:2000]}]}
                }
                with httpx.Client(timeout=15.0) as client:
                    resp = client.post(url, json=payload)
                    if resp.status_code == 200:
                        values = resp.json().get("embedding", {}).get("values", [])
                        if values:
                            return values
            except Exception as e:
                logger.warning(f"Gemini embedding failed: {e}")

        # 2. Try OpenAI Embeddings
        if openai_key:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=openai_key)
                response = client.embeddings.create(
                    input=[text[:2000]],
                    model="text-embedding-3-large",
                    dimensions=self.dimensions
                )
                return response.data[0].embedding
            except Exception as e:
                logger.warning(f"OpenAI embedding failed: {e}")

        return self._generate_deterministic_mock_embedding(text)

    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        return [self.generate_embedding(t) for t in texts]

    def _generate_deterministic_mock_embedding(self, text: str) -> List[float]:
        """Generates pseudo-random deterministic vector based on text hash."""
        hash_val = int(hashlib.sha256(text.encode("utf-8")).hexdigest(), 16)
        vec = []
        for i in range(self.dimensions):
            val = ((hash_val >> (i % 32)) & 0xFF) / 255.0 - 0.5
            vec.append(round(val, 6))
        return vec

embedding_generator = EmbeddingGenerator()

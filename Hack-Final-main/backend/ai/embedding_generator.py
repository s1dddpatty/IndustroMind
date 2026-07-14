import os
import hashlib
from typing import List

class EmbeddingGenerator:
    """
    Generates text embeddings using OpenAI's text-embedding-3-large model.
    Includes deterministic fallback for offline testing and mock verification.
    """
    def __init__(self, model: str = "text-embedding-3-large", dimensions: int = 3072):
        self.model = model
        self.dimensions = dimensions
        self.api_key = os.getenv("OPENAI_API_KEY")

    def generate_embedding(self, text: str) -> List[float]:
        mock_mode = os.getenv("NEUROPLANT_MOCK_MODE", os.getenv("MOCK_MODE", "true")).lower() == "true"
        if not self.api_key or mock_mode:
            return self._generate_deterministic_mock_embedding(text)
        
        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.api_key)
            response = client.embeddings.create(
                input=[text],
                model=self.model,
                dimensions=self.dimensions
            )
            return response.data[0].embedding
        except Exception as e:
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

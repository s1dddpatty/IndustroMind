import os
import json
import yaml
from pathlib import Path
from typing import Dict, Any, Optional

PROMPTS_DIR = Path(__file__).resolve().parent.parent.parent / "shared" / "prompts"

class PromptLoader:
    @staticmethod
    def load_prompt(prompt_name: str) -> Dict[str, str]:
        yaml_path = PROMPTS_DIR / f"{prompt_name}.yaml"
        if not yaml_path.exists():
            raise FileNotFoundError(f"Prompt file not found at {yaml_path}")
        with open(yaml_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        return data

class LLMClient:
    """
    Wrapper around OpenAI / LangChain LLM calls with deterministic fallback mocking
    for standalone testing without API keys or database connections.
    """
    def __init__(self, model_name: str = "gpt-oss-120b"):
        self.model_name = model_name
        self.api_key = os.getenv("CEREBRAS_API_KEY") or os.getenv("OPENAI_API_KEY")

    def invoke(self, system_prompt: str, user_prompt: str, mock_fallback: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        mock_mode = os.getenv("NEUROPLANT_MOCK_MODE", os.getenv("MOCK_MODE", "true")).lower() == "true"
        if not self.api_key or mock_mode:
            if mock_fallback is not None:
                return mock_fallback
            return {"status": "mocked", "message": "No API key provided or MOCK_MODE enabled."}
        
        try:
            from openai import OpenAI
            client = OpenAI(base_url="https://api.cerebras.ai/v1", api_key=self.api_key)
            response = client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.1
            )
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            if mock_fallback is not None:
                return mock_fallback
            raise RuntimeError(f"LLM call failed: {str(e)}")

llm_client = LLMClient()

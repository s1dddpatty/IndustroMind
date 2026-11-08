import os
import json
import re
import yaml
import logging
import httpx
from pathlib import Path
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Ensure .env is loaded
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")

logger = logging.getLogger("neuroplant.llm_client")
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
    Unified LLM Client supporting Google Gemini, OpenAI, and Cerebras.
    Gracefully falls back to mock data if network or API errors occur.
    """
    def __init__(self, model_name: str = "gemini-3.5-flash"):
        self.model_name = model_name
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.cerebras_api_key = os.getenv("CEREBRAS_API_KEY")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")

    def _refresh_keys(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.cerebras_api_key = os.getenv("CEREBRAS_API_KEY")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")

    def invoke(self, system_prompt: str, user_prompt: str, mock_fallback: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        self._refresh_keys()
        mock_mode = os.getenv("NEUROPLANT_MOCK_MODE", os.getenv("MOCK_MODE", "false")).lower() == "true"
        
        has_key = bool(self.gemini_api_key or self.cerebras_api_key or self.openai_api_key)
        if mock_mode or not has_key:
            if mock_fallback is not None:
                return mock_fallback
            return {"status": "mocked", "message": "MOCK_MODE enabled or no API key."}

        # 1. Try Gemini API with automatic model fallback cascade
        if self.gemini_api_key:
            gemini_models = [
                "gemini-3.5-flash",
                "gemini-flash-lite-latest",
                "gemini-3.5-flash-lite",
                "gemini-3.1-flash-lite",
            ]
            for model_name in gemini_models:
                try:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={self.gemini_api_key}"
                    payload = {
                        "system_instruction": {"parts": [{"text": system_prompt}]},
                        "contents": [{"parts": [{"text": user_prompt}]}],
                        "generationConfig": {
                            "responseMimeType": "application/json",
                            "temperature": 0.1
                        }
                    }
                    with httpx.Client(timeout=30.0) as client:
                        resp = client.post(url, json=payload)
                        if resp.status_code == 200:
                            raw_text = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
                            # Clean any stray markdown fencing
                            clean_json = re.sub(r"^```(?:json)?\s*", "", raw_text.strip(), flags=re.IGNORECASE)
                            clean_json = re.sub(r"\s*```$", "", clean_json)
                            return json.loads(clean_json)
                        elif resp.status_code in (429, 500, 503):
                            logger.warning(
                                f"Gemini model '{model_name}' busy or rate-limited (status {resp.status_code}). "
                                f"Falling back to next available model..."
                            )
                            continue
                        else:
                            logger.warning(f"Gemini API model '{model_name}' returned status {resp.status_code}: {resp.text[:200]}")
                            continue
                except Exception as e:
                    logger.warning(f"Gemini API model '{model_name}' call failed: {e}. Falling back to next available model...")
                    continue

        # 2. Try Cerebras API
        if self.cerebras_api_key:
            try:
                from openai import OpenAI
                client = OpenAI(base_url="https://api.cerebras.ai/v1", api_key=self.cerebras_api_key)
                response = client.chat.completions.create(
                    model="gpt-oss-120b",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.1
                )
                return json.loads(response.choices[0].message.content)
            except Exception as e:
                logger.warning(f"Cerebras API call failed: {e}")

        # 3. Try OpenAI API
        if self.openai_api_key:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=self.openai_api_key)
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.1
                )
                return json.loads(response.choices[0].message.content)
            except Exception as e:
                logger.warning(f"OpenAI API call failed: {e}")

        # Fallback to mock if all providers failed
        if mock_fallback is not None:
            logger.info("Using mock fallback after LLM attempts.")
            return mock_fallback

        raise RuntimeError("All LLM providers failed and no mock fallback available.")

llm_client = LLMClient()

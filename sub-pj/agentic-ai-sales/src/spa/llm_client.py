"""LLM client for Claude API integration."""

import json
import os
from pathlib import Path

import anthropic
import yaml

from spa.models import (
    CustomerInfo,
    DealContext,
    SlideContent,
)


def load_prompts() -> dict:
    """Load prompt templates from YAML file."""
    prompts_path = Path(__file__).parent.parent.parent / "data" / "prompts" / "slide_generation.yaml"
    if prompts_path.exists():
        with open(prompts_path) as f:
            return yaml.safe_load(f)
    return {}


class LLMClient:
    """Client for Claude API interactions."""

    def __init__(self, model: str = "claude-sonnet-4-20250514") -> None:
        """Initialize the LLM client."""
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable is required")
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = model
        self.prompts = load_prompts()

    def generate_slides(
        self,
        customer: CustomerInfo,
        context: DealContext,
    ) -> list[SlideContent]:
        """Generate slide content based on customer and context."""
        system_prompt = self.prompts.get("system_prompt", "")
        slide_types = self.prompts.get("slide_types", {})

        user_prompt = self._build_user_prompt(customer, context, slide_types)

        response = self.client.messages.create(
            model=self.model,
            max_tokens=4096,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )

        return self._parse_response(response.content[0].text)

    def _build_user_prompt(
        self,
        customer: CustomerInfo,
        context: DealContext,
        slide_types: dict,
    ) -> str:
        """Build the user prompt for slide generation."""
        prompt = f"""
## 顧客情報
- 会社名: {customer.company_name}
- 業界: {customer.industry.display_name}
- 企業規模: {customer.company_size.display_name}

## 商談コンテキスト
- シナリオ: {context.scenario_type.display_name}
- 今回のゴール: {context.goal}
- プレゼン時間: {context.duration_minutes}分
- 課題仮説:
{context.pain_hypothesis}

## 生成するスライド
以下のスライドを生成してください:

"""
        slide_order = ["title", "agenda", "situation", "problem", "implication", "need_payoff", "next_steps"]
        for slide_type in slide_order:
            if slide_type in slide_types:
                info = slide_types[slide_type]
                prompt += f"\n### {info['name']}\n{info['prompt']}\n"

        return prompt

    def _parse_response(self, response_text: str) -> list[SlideContent]:
        """Parse LLM response into SlideContent objects."""
        try:
            start = response_text.find("{")
            end = response_text.rfind("}") + 1
            if start >= 0 and end > start:
                json_str = response_text[start:end]
                data = json.loads(json_str)
                slides = []
                for slide_data in data.get("slides", []):
                    slides.append(SlideContent(**slide_data))
                return slides
        except (json.JSONDecodeError, KeyError, TypeError):
            pass
        return []

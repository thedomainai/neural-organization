"""Data models for Sales Presentation Automator."""

from enum import Enum
from pydantic import BaseModel, Field


class Industry(str, Enum):
    """Industry categories."""

    IT_SOFTWARE = "it_software"
    MANUFACTURING = "manufacturing"
    FINANCE = "finance"
    RETAIL = "retail"
    HEALTHCARE = "healthcare"
    OTHER = "other"

    @property
    def display_name(self) -> str:
        """Get Japanese display name."""
        names = {
            "it_software": "IT・ソフトウェア",
            "manufacturing": "製造",
            "finance": "金融",
            "retail": "小売",
            "healthcare": "医療",
            "other": "その他",
        }
        return names.get(self.value, self.value)


class CompanySize(str, Enum):
    """Company size categories."""

    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    ENTERPRISE = "enterprise"

    @property
    def display_name(self) -> str:
        """Get Japanese display name."""
        names = {
            "small": "〜50名",
            "medium": "51-300名",
            "large": "301-1000名",
            "enterprise": "1001名〜",
        }
        return names.get(self.value, self.value)


class ScenarioType(str, Enum):
    """Presentation scenario types."""

    NEW_BUSINESS_1ST = "new_business_1st"

    @property
    def display_name(self) -> str:
        """Get Japanese display name."""
        names = {
            "new_business_1st": "新規1次商談（課題仮説+ヒアリング）",
        }
        return names.get(self.value, self.value)


class CustomerInfo(BaseModel):
    """Customer information model."""

    company_name: str = Field(..., description="Company name")
    industry: Industry = Field(..., description="Industry category")
    company_size: CompanySize = Field(..., description="Company size")
    url: str | None = Field(None, description="Company website URL")


class DealContext(BaseModel):
    """Deal context model."""

    scenario_type: ScenarioType = Field(..., description="Presentation scenario type")
    goal: str = Field(..., description="Goal of this presentation")
    duration_minutes: int = Field(30, description="Presentation duration in minutes")
    pain_hypothesis: str = Field(..., description="Hypothesized customer pain points")


class SlideContent(BaseModel):
    """Individual slide content."""

    slide_type: str = Field(..., description="Type of slide")
    title: str = Field(..., description="Slide title")
    main_message: str = Field(..., description="Main message")
    bullet_points: list[str] = Field(default_factory=list, description="Bullet points")
    speaker_notes: str = Field("", description="Speaker notes")


class PresentationContent(BaseModel):
    """Complete presentation content."""

    customer: CustomerInfo
    context: DealContext
    slides: list[SlideContent] = Field(default_factory=list)


class GenerationRequest(BaseModel):
    """Request model for presentation generation."""

    customer: CustomerInfo
    context: DealContext

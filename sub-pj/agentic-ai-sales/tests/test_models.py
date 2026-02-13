"""Tests for data models."""

import pytest
from spa.models import (
    CustomerInfo,
    DealContext,
    Industry,
    CompanySize,
    ScenarioType,
    SlideContent,
    PresentationContent,
)


class TestIndustry:
    """Tests for Industry enum."""

    def test_display_names(self):
        """Test that all industries have display names."""
        for industry in Industry:
            assert industry.display_name is not None
            assert len(industry.display_name) > 0

    def test_it_software_display_name(self):
        """Test IT Software display name."""
        assert Industry.IT_SOFTWARE.display_name == "IT・ソフトウェア"


class TestCompanySize:
    """Tests for CompanySize enum."""

    def test_display_names(self):
        """Test that all company sizes have display names."""
        for size in CompanySize:
            assert size.display_name is not None
            assert len(size.display_name) > 0


class TestCustomerInfo:
    """Tests for CustomerInfo model."""

    def test_create_customer_info(self):
        """Test creating customer info."""
        customer = CustomerInfo(
            company_name="テスト株式会社",
            industry=Industry.IT_SOFTWARE,
            company_size=CompanySize.MEDIUM,
        )
        assert customer.company_name == "テスト株式会社"
        assert customer.industry == Industry.IT_SOFTWARE
        assert customer.company_size == CompanySize.MEDIUM
        assert customer.url is None

    def test_create_customer_info_with_url(self):
        """Test creating customer info with URL."""
        customer = CustomerInfo(
            company_name="テスト株式会社",
            industry=Industry.IT_SOFTWARE,
            company_size=CompanySize.MEDIUM,
            url="https://example.com",
        )
        assert customer.url == "https://example.com"


class TestDealContext:
    """Tests for DealContext model."""

    def test_create_deal_context(self):
        """Test creating deal context."""
        context = DealContext(
            scenario_type=ScenarioType.NEW_BUSINESS_1ST,
            goal="2次商談への移行承諾を得る",
            duration_minutes=30,
            pain_hypothesis="業務効率化の課題がある",
        )
        assert context.scenario_type == ScenarioType.NEW_BUSINESS_1ST
        assert context.goal == "2次商談への移行承諾を得る"
        assert context.duration_minutes == 30
        assert context.pain_hypothesis == "業務効率化の課題がある"


class TestSlideContent:
    """Tests for SlideContent model."""

    def test_create_slide_content(self):
        """Test creating slide content."""
        slide = SlideContent(
            slide_type="title",
            title="テストタイトル",
            main_message="メインメッセージ",
            bullet_points=["ポイント1", "ポイント2"],
            speaker_notes="ノート",
        )
        assert slide.slide_type == "title"
        assert slide.title == "テストタイトル"
        assert len(slide.bullet_points) == 2


class TestPresentationContent:
    """Tests for PresentationContent model."""

    def test_create_presentation_content(self):
        """Test creating presentation content."""
        customer = CustomerInfo(
            company_name="テスト株式会社",
            industry=Industry.IT_SOFTWARE,
            company_size=CompanySize.MEDIUM,
        )
        context = DealContext(
            scenario_type=ScenarioType.NEW_BUSINESS_1ST,
            goal="テスト",
            pain_hypothesis="テスト課題",
        )
        content = PresentationContent(customer=customer, context=context)
        assert content.customer.company_name == "テスト株式会社"
        assert len(content.slides) == 0

"""CLI interface for Sales Presentation Automator."""

from datetime import datetime
from pathlib import Path

import click
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt, Confirm
from rich.progress import Progress, SpinnerColumn, TextColumn

from spa.models import (
    CustomerInfo,
    DealContext,
    Industry,
    CompanySize,
    ScenarioType,
    PresentationContent,
)
from spa.llm_client import LLMClient
from spa.pptx_generator import PPTXGenerator

console = Console()


def display_welcome() -> None:
    """Display welcome message."""
    console.print(
        Panel.fit(
            "[bold blue]Sales Presentation Automator[/bold blue]\n"
            "[dim]AI-powered presentation generator[/dim]",
            border_style="blue",
        )
    )
    console.print()


def get_customer_info() -> CustomerInfo:
    """Interactively collect customer information."""
    console.print("[bold]■ 顧客情報[/bold]", style="blue")
    console.print()

    company_name = Prompt.ask("  会社名")

    console.print("\n  業界を選択してください:")
    for i, industry in enumerate(Industry, 1):
        console.print(f"    {i}. {industry.display_name}")
    industry_choice = Prompt.ask("  選択", choices=[str(i) for i in range(1, len(Industry) + 1)])
    industry = list(Industry)[int(industry_choice) - 1]

    console.print("\n  企業規模を選択してください:")
    for i, size in enumerate(CompanySize, 1):
        console.print(f"    {i}. {size.display_name}")
    size_choice = Prompt.ask("  選択", choices=[str(i) for i in range(1, len(CompanySize) + 1)])
    company_size = list(CompanySize)[int(size_choice) - 1]

    url = Prompt.ask("  企業URL（任意）", default="")

    return CustomerInfo(
        company_name=company_name,
        industry=industry,
        company_size=company_size,
        url=url if url else None,
    )


def get_deal_context() -> DealContext:
    """Interactively collect deal context."""
    console.print("\n[bold]■ 商談コンテキスト[/bold]", style="blue")
    console.print()

    console.print("  プレゼン種類を選択してください:")
    for i, scenario in enumerate(ScenarioType, 1):
        console.print(f"    {i}. {scenario.display_name}")
    scenario_choice = Prompt.ask("  選択", choices=[str(i) for i in range(1, len(ScenarioType) + 1)])
    scenario_type = list(ScenarioType)[int(scenario_choice) - 1]

    goal = Prompt.ask("\n  今回のゴール", default="2次商談への移行承諾を得る")

    console.print("\n  プレゼン時間を選択してください:")
    duration_options = [("1", "15分", 15), ("2", "30分", 30), ("3", "60分", 60)]
    for opt in duration_options:
        console.print(f"    {opt[0]}. {opt[1]}")
    duration_choice = Prompt.ask("  選択", choices=["1", "2", "3"], default="2")
    duration = next(opt[2] for opt in duration_options if opt[0] == duration_choice)

    console.print("\n  課題仮説を入力してください（複数行可、空行で終了）:")
    pain_lines = []
    while True:
        line = Prompt.ask("  ", default="")
        if not line:
            break
        pain_lines.append(line)
    pain_hypothesis = "\n".join(pain_lines) if pain_lines else "業務効率化の課題がある"

    return DealContext(
        scenario_type=scenario_type,
        goal=goal,
        duration_minutes=duration,
        pain_hypothesis=pain_hypothesis,
    )


def generate_presentation(customer: CustomerInfo, context: DealContext) -> PresentationContent:
    """Generate presentation content using LLM."""
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        progress.add_task(description="スライド内容を生成中...", total=None)

        llm_client = LLMClient()
        slides = llm_client.generate_slides(customer, context)

    return PresentationContent(customer=customer, context=context, slides=slides)


def create_pptx(content: PresentationContent, output_dir: Path) -> Path:
    """Create PowerPoint file from content."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{content.customer.company_name}_{timestamp}.pptx"
    output_path = output_dir / filename

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        progress.add_task(description="PowerPointファイルを生成中...", total=None)

        generator = PPTXGenerator()
        generator.generate(content, output_path)

    return output_path


@click.command()
@click.option(
    "--output-dir",
    "-o",
    type=click.Path(path_type=Path),
    default=Path("./output"),
    help="Output directory for generated files",
)
def main(output_dir: Path) -> None:
    """Generate a sales presentation with AI assistance."""
    display_welcome()

    try:
        # Collect input
        customer = get_customer_info()
        context = get_deal_context()

        # Confirm
        console.print("\n[bold]■ 入力内容の確認[/bold]", style="blue")
        console.print(f"  会社名: {customer.company_name}")
        console.print(f"  業界: {customer.industry.display_name}")
        console.print(f"  企業規模: {customer.company_size.display_name}")
        console.print(f"  シナリオ: {context.scenario_type.display_name}")
        console.print(f"  ゴール: {context.goal}")
        console.print(f"  時間: {context.duration_minutes}分")
        console.print()

        if not Confirm.ask("この内容で生成しますか？"):
            console.print("[yellow]キャンセルしました[/yellow]")
            return

        # Generate
        console.print()
        content = generate_presentation(customer, context)

        if not content.slides:
            console.print("[red]スライドの生成に失敗しました[/red]")
            return

        console.print(f"[green]✓[/green] {len(content.slides)}枚のスライドを生成しました")

        # Create PPTX
        output_path = create_pptx(content, output_dir)
        console.print(f"[green]✓[/green] ファイルを作成しました: {output_path}")

        console.print()
        console.print(
            Panel.fit(
                f"[bold green]完了！[/bold green]\n\n"
                f"出力ファイル: {output_path}",
                border_style="green",
            )
        )

    except KeyboardInterrupt:
        console.print("\n[yellow]中断しました[/yellow]")
    except ValueError as e:
        console.print(f"\n[red]エラー: {e}[/red]")
        raise SystemExit(1)


if __name__ == "__main__":
    main()

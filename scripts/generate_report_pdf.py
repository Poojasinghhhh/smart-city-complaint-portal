from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer


def build_pdf(markdown_path: Path, pdf_path: Path) -> None:
    text = markdown_path.read_text(encoding="utf-8")
    lines = text.splitlines()

    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=1 * inch,
        rightMargin=1 * inch,
        topMargin=1 * inch,
        bottomMargin=1 * inch,
        title="Smart City Complaint Portal Project Report",
        author="Project Report Generator",
    )

    styles = getSampleStyleSheet()
    body = ParagraphStyle(
        "Body12",
        parent=styles["Normal"],
        fontName="Times-Roman",
        fontSize=12,
        leading=18,  # 1.5 spacing at size 12
        spaceAfter=8,
    )
    h1 = ParagraphStyle(
        "H1",
        parent=styles["Heading1"],
        fontName="Times-Bold",
        fontSize=18,
        leading=24,
        spaceBefore=12,
        spaceAfter=10,
        textColor=colors.black,
    )
    h2 = ParagraphStyle(
        "H2",
        parent=styles["Heading2"],
        fontName="Times-Bold",
        fontSize=14,
        leading=20,
        spaceBefore=10,
        spaceAfter=8,
    )
    h3 = ParagraphStyle(
        "H3",
        parent=styles["Heading3"],
        fontName="Times-BoldItalic",
        fontSize=12,
        leading=18,
        spaceBefore=8,
        spaceAfter=6,
    )

    story = []
    bullet_buffer = []

    def flush_bullets():
        nonlocal bullet_buffer
        if not bullet_buffer:
            return
        items = [
            ListItem(Paragraph(item, body), leftIndent=12)
            for item in bullet_buffer
        ]
        story.append(
            ListFlowable(
                items,
                bulletType="bullet",
                start="circle",
                leftIndent=18,
                bulletFontName="Times-Roman",
                bulletFontSize=10,
            )
        )
        story.append(Spacer(1, 6))
        bullet_buffer = []

    for raw in lines:
        line = raw.strip()
        if not line:
            flush_bullets()
            story.append(Spacer(1, 6))
            continue

        if line.startswith("---"):
            flush_bullets()
            story.append(Spacer(1, 10))
            continue

        if line.startswith("# "):
            flush_bullets()
            story.append(Paragraph(line[2:].strip(), h1))
            continue
        if line.startswith("## "):
            flush_bullets()
            story.append(Paragraph(line[3:].strip(), h2))
            continue
        if line.startswith("### "):
            flush_bullets()
            story.append(Paragraph(line[4:].strip(), h3))
            continue

        if line.startswith("- "):
            bullet_buffer.append(line[2:].strip())
            continue

        flush_bullets()
        safe_line = line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        story.append(Paragraph(safe_line, body))

    flush_bullets()
    doc.build(story)


if __name__ == "__main__":
    project_root = Path(__file__).resolve().parents[1]
    source = project_root / "PROJECT_REPORT_FULL_DRAFT.md"
    target = project_root / "PROJECT_REPORT_FULL_DRAFT.pdf"
    build_pdf(source, target)
    print(f"PDF generated: {target}")

"""Extract Appendix A (78-tool catalog) and key plan details from the build plan docx."""
from docx import Document

doc = Document("/home/z/my-project/download/Utility-Tools-Platform-Build-Plan.docx")

# Print all headings for structure reference
print("=== HEADINGS ===")
for p in doc.paragraphs:
    if p.style.name.startswith("Heading"):
        print(f"[{p.style.name}] {p.text}")

print("\n=== TABLES ===")
for i, t in enumerate(doc.tables):
    print(f"\n--- Table {i} ({len(t.rows)} rows x {len(t.columns)} cols) ---")
    for r_idx, row in enumerate(t.rows[:100]):
        cells = [c.text.strip().replace("\n", " / ") for c in row.cells]
        print(f"  R{r_idx}: {' | '.join(cells)}")
        if r_idx > 90:
            break

#!/usr/bin/env python3
"""patch_docx.py — post-process the generated docx for WPS/Word compatibility:
1. Remove empty <w:pgNumType/> from document.xml (cover section artifact)
2. Patch footer PAGE fields with explicit format switches:
   - front-matter footer (first footerReference in document.xml) -> PAGE \\* ROMAN \\* MERGEFORMAT
   - body footer (second footerReference)                        -> PAGE \\* arabic \\* MERGEFORMAT
"""
import re
import shutil
import sys
import zipfile

DOCX = sys.argv[1] if len(sys.argv) > 1 else "/home/z/my-project/download/Utility-Tools-Platform-Build-Plan.docx"
TMP = DOCX + ".tmp"

with zipfile.ZipFile(DOCX, "r") as zin:
    names = zin.namelist()
    data = {n: zin.read(n) for n in names}

doc_xml = data["word/document.xml"].decode("utf-8")

# 1. Remove empty pgNumType artifacts
removed = len(re.findall(r"<w:pgNumType/>", doc_xml))
doc_xml = doc_xml.replace("<w:pgNumType/>", "")
data["word/document.xml"] = doc_xml.encode("utf-8")
print(f"Removed {removed} empty <w:pgNumType/> elements")

# 2. Map footerReference rIds (in document order) to footer files
rels_xml = data["word/_rels/document.xml.rels"].decode("utf-8")
rid_to_target = dict(re.findall(r'<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"', rels_xml))
footer_rids = re.findall(r'<w:footerReference[^>]*r:id="([^"]+)"', doc_xml)
print("Footer references in document order:", footer_rids)

formats = ["ROMAN", "arabic"]  # front matter first, body second
seen = []
for rid in footer_rids:
    if rid in seen:
        continue
    seen.append(rid)
    idx = len(seen) - 1
    fmt = formats[idx] if idx < len(formats) else "arabic"
    target = rid_to_target.get(rid, "")
    fname = "word/" + target.lstrip("/")
    if fname not in data:
        print(f"  WARN: {fname} not found for rId {rid}")
        continue
    fxml = data[fname].decode("utf-8")
    new_fxml, n = re.subn(
        r"(<w:instrText[^>]*>)\s*PAGE\s*(</w:instrText>)",
        rf"\1 PAGE \\* {fmt} \\* MERGEFORMAT \2",
        fxml,
    )
    if n == 0:
        print(f"  WARN: no bare PAGE field found in {fname}")
    else:
        data[fname] = new_fxml.encode("utf-8")
        print(f"  Patched {fname}: {n} PAGE field(s) -> \\* {fmt}")

# 3. Fix TOC placeholder duplicate: the placeholder script leaves the first entry
#    both inside the TOC field paragraph (with an empty PAGEREF result) and as a
#    literal paragraph. Give the PAGEREF a cached "1" result and drop the duplicate.
doc_xml = data["word/document.xml"].decode("utf-8")
empty_pageref = '<w:fldChar w:fldCharType="separate"/><w:fldChar w:fldCharType="end"/>'
if doc_xml.count(empty_pageref) == 1:
    doc_xml = doc_xml.replace(
        empty_pageref,
        '<w:fldChar w:fldCharType="separate"/><w:r><w:t>1</w:t></w:r><w:fldChar w:fldCharType="end"/>',
    )
    print("Filled empty PAGEREF result in TOC field paragraph with cached page 1")
else:
    print(f"WARN: expected 1 empty PAGEREF gap, found {doc_xml.count(empty_pageref)}")

dup_para = ('<w:p><w:pPr><w:pStyle w:val="TOC1"/><w:tabs><w:tab w:val="right" w:leader="dot" '
            'w:pos="9026"/></w:tabs><w:spacing w:before="120" w:after="60"/></w:pPr>'
            '<w:r><w:t>Executive Summary</w:t></w:r><w:r><w:tab/></w:r><w:r><w:t>1</w:t></w:r></w:p>')
n_dup = doc_xml.count(dup_para)
if n_dup == 1:
    doc_xml = doc_xml.replace(dup_para, "")
    print("Removed duplicate literal 'Executive Summary' TOC entry")
else:
    print(f"WARN: expected 1 duplicate TOC entry, found {n_dup}")

data["word/document.xml"] = doc_xml.encode("utf-8")

with zipfile.ZipFile(TMP, "w", zipfile.ZIP_DEFLATED) as zout:
    for n in names:
        zout.writestr(n, data[n])
shutil.move(TMP, DOCX)
print("Post-processing complete:", DOCX)

# -*- coding: utf-8 -*-
from pathlib import Path
import re
import zipfile

SOURCE = Path(r"C:/Users/Administrator/Documents/xwechat_files/wxid_xbi9o0tdyhpq12_be07/msg/file/2026-08/独立站AI图-新增产品图片.xlsx")
OUTPUT = Path(r"C:/Users/Administrator/Documents/独立站修改/outputs/bba0b1ee-4668-45c7-9d4d-4e52d1a58816/独立站AI图-新增产品图片-商务洽谈已补充实拍图.xlsx")

with zipfile.ZipFile(SOURCE) as src, zipfile.ZipFile(OUTPUT) as out:
    src_sheet = src.read("xl/worksheets/sheet1.xml").decode("utf-8")
    out_sheet = out.read("xl/worksheets/sheet1.xml").decode("utf-8")
    src_cell_images = src.read("xl/cellimages.xml").decode("utf-8")
    out_cell_images = out.read("xl/cellimages.xml").decode("utf-8")
    src_rels = src.read("xl/_rels/cellimages.xml.rels").decode("utf-8")
    out_rels = out.read("xl/_rels/cellimages.xml.rels").decode("utf-8")

    row = re.search(r'<row\b[^>]*\br="26"[^>]*>.*?</row>', out_sheet)
    formulas = re.findall(r'<f>(.*?)</f>', row.group(0))
    print({
        "source_cell_images": src_cell_images.count("<etc:cellImage>"),
        "output_cell_images": out_cell_images.count("<etc:cellImage>"),
        "source_relationships": src_rels.count("<Relationship "),
        "output_relationships": out_rels.count("<Relationship "),
        "row26_formula_count": len(formulas),
        "row26_formula_preview": formulas[:10],
    })

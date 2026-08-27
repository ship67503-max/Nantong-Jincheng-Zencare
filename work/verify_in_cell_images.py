import re
import zipfile
from pathlib import Path

source = Path(r'C:/Users/Administrator/Desktop/独立站AI图-新增产品图片.xlsx')
output = Path(r'outputs/019fda3e-27bd-7c42-a500-0654a578f42f/独立站AI图-新增产品图片-单元格内实拍图.xlsx')

with zipfile.ZipFile(source) as src, zipfile.ZipFile(output) as out:
    assert out.testzip() is None
    src_sheet = src.read('xl/worksheets/sheet1.xml').decode('utf-8')
    out_sheet = out.read('xl/worksheets/sheet1.xml').decode('utf-8')
    src_cell_images = src.read('xl/cellimages.xml').decode('utf-8')
    out_cell_images = out.read('xl/cellimages.xml').decode('utf-8')
    src_rels = src.read('xl/_rels/cellimages.xml.rels').decode('utf-8')
    out_rels = out.read('xl/_rels/cellimages.xml.rels').decode('utf-8')

    def formulas_by_cell(xml: str) -> dict[str, str]:
        result = {}
        for cell in re.finditer(r'<c r="([A-Z]+\d+)"[^>]*>(.*?)</c>', xml):
            formula = re.search(r'<f>(.*?)</f>', cell.group(2))
            if formula:
                result[cell.group(1)] = formula.group(1)
        return result

    src_formulas = formulas_by_cell(src_sheet)
    out_formulas = formulas_by_cell(out_sheet)
    unchanged = all(out_formulas.get(address) == formula for address, formula in src_formulas.items())
    inline_media = [name for name in out.namelist() if name.startswith('xl/media/embedded_real_')]

    differences = [address for address, formula in src_formulas.items() if out_formulas.get(address) != formula]
    result = {
        'source_formula_cells': len(src_formulas),
        'output_formula_cells': len(out_formulas),
        'new_formula_cells': len(out_formulas) - len(src_formulas),
        'source_cell_images': src_cell_images.count('<etc:cellImage>'),
        'output_cell_images': out_cell_images.count('<etc:cellImage>'),
        'new_cell_images': out_cell_images.count('<etc:cellImage>') - src_cell_images.count('<etc:cellImage>'),
        'new_image_relationships': out_rels.count('<Relationship ') - src_rels.count('<Relationship '),
        'new_media_files': len(inline_media),
        'source_formulas_unchanged': unchanged,
        'formula_differences': differences[:10],
        'page_details_unchanged': src.read('xl/worksheets/sheet2.xml') == out.read('xl/worksheets/sheet2.xml'),
    }
    print(result)

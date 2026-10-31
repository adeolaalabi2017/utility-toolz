"""Extract colors + typography regions from the Larkfield screenshot."""
from PIL import Image
from collections import Counter

img = Image.open('/home/z/my-project/upload/larkfield.png').convert('RGB')
W, H = img.size
print(f"size: {W}x{H}")

def hexc(p):
    return '#%02x%02x%02x' % p

def region_colors(x0, y0, x1, y1, top=8, label=''):
    box = img.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)))
    cnt = Counter(box.getdata())
    print(f"-- {label} ({x0},{y0},{x1},{y1}) --")
    for c, n in cnt.most_common(top):
        print(f"   {hexc(c)}  x{n}")
    return cnt.most_common(top)

# Sample key regions (fractions based on full-page layout)
region_colors(0.0, 0.0, 1.0, 0.012, 4, 'very top nav bar bg')
region_colors(0.03, 0.035, 0.55, 0.10, 10, 'hero text area')
region_colors(0.05, 0.045, 0.35, 0.075, 10, 'hero heading pixels')
region_colors(0.30, 0.18, 0.70, 0.24, 8, 'section heading area')
region_colors(0.04, 0.185, 0.32, 0.30, 10, 'left bento card')
region_colors(0.66, 0.185, 0.97, 0.28, 10, 'right dark card')
region_colors(0.05, 0.36, 0.30, 0.41, 10, 'stat card pink/red')
region_colors(0.35, 0.36, 0.55, 0.41, 10, 'stat card mid')
region_colors(0.60, 0.36, 0.80, 0.41, 10, 'stat card right')
region_colors(0.02, 0.56, 0.98, 0.62, 12, 'example cards row')
region_colors(0.0, 0.965, 1.0, 1.0, 10, 'footer bottom')
region_colors(0.25, 0.90, 0.75, 0.95, 10, 'footer CTA card')

# Save zoomed crops for typography inspection
crops = {
    'hero': (0.02, 0.025, 0.60, 0.115),
    'bento': (0.02, 0.175, 0.98, 0.345),
    'stats': (0.02, 0.345, 0.98, 0.425),
    'platform': (0.02, 0.43, 0.98, 0.55),
    'examples': (0.02, 0.545, 0.98, 0.63),
    'footer': (0.02, 0.895, 0.98, 1.0),
    'nav': (0.0, 0.0, 1.0, 0.025),
}
import os
os.makedirs('/home/z/my-project/scripts/lark_crops', exist_ok=True)
for name, (x0, y0, x1, y1) in crops.items():
    box = img.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)))
    scale = min(3.0, 1500 / max(box.width, 1))
    if scale > 1:
        box = box.resize((int(box.width * scale), int(box.height * scale)), Image.LANCZOS)
    box.save(f'/home/z/my-project/scripts/lark_crops/{name}.png')
    print(f"saved {name}.png {box.size}")

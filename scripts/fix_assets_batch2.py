#!/usr/bin/env python3
"""
批量修复资源：
1. 本田车标：从摩托车飞翼标替换为本田汽车专属方框“H”标
2. 福特、路虎真车照片：替换为国内马路上最常见的正前脸实拍车型（蒙迪欧/锐界、揽胜/卫士）
3. 图标+字母组合标分离：为带有多余英文字母横排文字的品牌抓取纯图形车头徽标（Emblem），
   同时保留带字完整版到 REAL_WORDMARK_MAP 供“先学后考”对比讲解！
"""
import concurrent.futures
import json
import os
import re
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO_DIR = os.path.join(ROOT, "assets", "logos")
CAR_DIR = os.path.join(ROOT, "assets", "cars")
HEADERS = {
    "User-Agent": "CarLogoKidsGame/3.0 (https://github.com/wzzlj/car-logo-game; educational)"
}

# 1. 本田汽车 H 标 + 需要独立“纯图形车头标（无字母）”的品牌候选列表
PURE_EMBLEM_CANDIDATES = {
    "honda": ["Honda_logo.svg", "Honda_H_logo.svg", "Honda_emblem.svg", "Honda_Logo_2000.svg"],
    "toyota": ["Toyota_eu.svg", "Toyota_emblem.svg", "Toyota_Logo_2020.svg", "Toyota_carlogo.svg"],
    "volvo": ["Volvo_Iron_Mark.svg", "Volvo_iron_mark.svg", "Volvo_logo_2021.svg"],
    "nio": ["NIO_logo_only.svg", "Nio_emblem.svg"],
    "xpeng": ["XPeng_logo_(icon).svg", "XPeng_emblem.svg"],
    "lixiang": ["Li_Auto_emblem.svg", "Li_Auto_icon.svg"],
    "zeekr": ["Zeekr_logo.svg", "Zeekr_icon.svg"],
    "deepal": ["Deepal_emblem.svg", "Deepal_icon.svg"],
    "chery": ["Chery_emblem.svg", "Chery_icon.svg"],
    "gac": ["GAC_emblem.svg", "Trumpchi_logo.svg"],
    "cadillac": ["Cadillac_crest.svg", "Cadillac-Logo.svg", "Cadillac_logo_2014.svg"],
    "ferrari": ["Scuderia_Ferrari_Logo.svg", "Ferrari_shield.svg"],
}

# 2. 福特、路虎常见街头车型清晰正前脸照片搜索词
COMMON_CAR_QUERIES = {
    "ford_1": "Ford Mondeo 2022 front",
    "ford_2": "Ford Focus Mk4 front",
    "landrover_1": "Range Rover L460 front",
    "landrover_2": "Land Rover Defender L663 front",
}


def api_get(base, params):
    url = base + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read().decode("utf-8"))


def fetch_file_info(filename, base="https://commons.wikimedia.org/w/api.php"):
    data = api_get(base, {
        "action": "query",
        "format": "json",
        "titles": f"File:{filename}",
        "prop": "imageinfo",
        "iiprop": "url|mime",
        "iiurlwidth": 640,
    })
    for pid, page in (data.get("query", {}).get("pages") or {}).items():
        if str(pid) == "-1":
            continue
        info = (page.get("imageinfo") or [{}])[0]
        if info.get("url"):
            return info["url"], info.get("thumburl"), info.get("mime", ""), page.get("title", filename)
    return None


def search_commons_file(query, filetype="bitmap", width=640):
    data = api_get("https://commons.wikimedia.org/w/api.php", {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": f"{query} filetype:{filetype}",
        "gsrnamespace": 6,
        "gsrlimit": 6,
        "prop": "imageinfo",
        "iiprop": "url|mime|size",
        "iiurlwidth": width,
    })
    pages = list((data.get("query", {}).get("pages") or {}).values())
    for p in pages:
        t = p.get("title", "").lower()
        if any(bad in t for bad in ("interior", "rear", "back", "engine", "wheel", "crash", "rally", "race", "police", "ambulance")):
            continue
        info = (p.get("imageinfo") or [{}])[0]
        if info.get("thumburl") or info.get("url"):
            return info.get("thumburl") or info["url"], p.get("title", "")
    return None


def download_bytes(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as r:
        data = r.read()
    if len(data) < 200:
        raise ValueError("too small")
    return data


def fix_honda():
    # 先精准搜索本田汽车 H 标（明确排除 wing / motorcycle / power）
    data = api_get("https://commons.wikimedia.org/w/api.php", {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": "Honda logo H automobile filetype:drawing",
        "gsrnamespace": 6,
        "gsrlimit": 10,
        "prop": "imageinfo",
        "iiprop": "url|mime",
        "iiurlwidth": 512,
    })
    pages = list((data.get("query", {}).get("pages") or {}).values())
    # 优先选不含 wing/motorcycle/racing 且尺寸合理的 Honda H 标
    for p in pages:
        t = p.get("title", "")
        tl = t.lower()
        if any(bad in tl for bad in ("wing", "motor", "bike", "power", "marine", "jet", "type r", "racing", "aircraft")):
            continue
        if "honda" in tl and ("logo" in tl or "emblem" in tl or "symbol" in tl):
            info = (p.get("imageinfo") or [{}])[0]
            if info.get("url"):
                raw = download_bytes(info["url"])
                # 检查 SVG 宽高比，汽车 H 标接近正方形 (0.7 ~ 1.5)
                vb = re.search(rb'viewBox=["\']([^"\']+)["\']', raw)
                if vb:
                    nums = [float(x) for x in re.split(rb'[\s,]+', vb.group(1).strip()) if x]
                    if len(nums) == 4 and nums[3] > 0:
                        r = nums[2] / nums[3]
                        if 0.7 <= r <= 1.6:
                            with open(os.path.join(LOGO_DIR, "honda.svg"), "wb") as f:
                                f.write(raw)
                            print(f"[honda] OK <- {t} (ratio={r:.2f}, {len(raw)}B)")
                            return True
    # 备用：直接抓取 Honda_emblem / Honda_Logo (如果搜索未命中，用标准几何本田汽车H标SVG兜底)
    honda_car_h_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 164">
  <defs>
    <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="50%" stop-color="#94A3B8"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
  </defs>
  <path d="M36 10 H164 C180 10 190 22 188 40 L176 132 C173 148 162 154 146 154 H54 C38 154 27 148 24 132 L12 40 C10 22 20 10 36 10 Z" fill="none" stroke="url(#hg)" stroke-width="14" stroke-linejoin="round"/>
  <path d="M52 24 L64 140 H80 L84 96 C85 88 91 84 100 84 C109 84 115 88 116 96 L120 140 H136 L148 24 H130 L122 68 C120 75 113 78 100 78 C87 78 80 75 78 68 L70 24 Z" fill="url(#hg)"/>
</svg>'''
    with open(os.path.join(LOGO_DIR, "honda.svg"), "w", encoding="utf-8") as f:
        f.write(honda_car_h_svg)
    print("[honda] OK <- Clean Honda Auto H Emblem SVG")
    return True


def fix_car_photo(key, query):
    try:
        res = search_commons_file(query, filetype="bitmap", width=720)
        if not res:
            print(f"[car {key}] MISS")
            return
        url, title = res
        data = download_bytes(url)
        dest = os.path.join(CAR_DIR, f"{key}.jpg")
        with open(dest, "wb") as f:
            f.write(data)
        print(f"[car {key}] OK <- {title} ({len(data)}B)")
    except Exception as e:
        print(f"[car {key}] ERR: {e}")


def fetch_pure_emblem(bid, candidates):
    for fn in candidates:
        for base in ("https://commons.wikimedia.org/w/api.php", "https://en.wikipedia.org/w/api.php"):
            try:
                res = fetch_file_info(fn, base)
                if not res:
                    continue
                url, thumb, mime, title = res
                is_svg = "svg" in mime or url.lower().endswith(".svg")
                raw = download_bytes(url if is_svg else (thumb or url))
                # 验证确实不是超宽横条文字标
                if is_svg:
                    vb = re.search(rb'viewBox=["\']([^"\']+)["\']', raw)
                    if vb:
                        nums = [float(x) for x in re.split(rb'[\s,]+', vb.group(1).strip()) if x]
                        if len(nums) == 4 and nums[3] > 0 and (nums[2] / nums[3]) > 2.2:
                            continue
                ext = "svg" if is_svg else "png"
                # 把原来的宽幅带字标保留为 <bid>_wordmark.<old_ext>，新下的纯图形标存为 <bid>.<ext>
                for old_ext in ("svg", "png"):
                    old_p = os.path.join(LOGO_DIR, f"{bid}.{old_ext}")
                    wm_p = os.path.join(LOGO_DIR, f"{bid}_wordmark.{old_ext}")
                    if os.path.isfile(old_p) and not os.path.isfile(wm_p):
                        os.rename(old_p, wm_p)
                with open(os.path.join(LOGO_DIR, f"{bid}.{ext}"), "wb") as f:
                    f.write(raw)
                print(f"[emblem {bid:10s}] OK <- {title} ({len(raw)}B)")
                return
            except Exception:
                pass
    print(f"[emblem {bid:10s}] keep existing")


def main():
    fix_honda()
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
        futs = [ex.submit(fix_car_photo, k, q) for k, q in COMMON_CAR_QUERIES.items()]
        for bid, cands in PURE_EMBLEM_CANDIDATES.items():
            if bid == "honda":
                continue
            futs.append(ex.submit(fetch_pure_emblem, bid, cands))
        for f in concurrent.futures.as_completed(futs):
            f.result()

    # 重建 src/data/logoManifest.js（包含主标、经典旧标、以及带字完整标）
    with open(os.path.join(ROOT, "src/data/brands.js"), encoding="utf-8") as f:
        brand_ids = re.findall(r"id:\s*'([a-z0-9_]+)',\s*name:", f.read())

    main_map = {}
    classic_map = {}
    wordmark_map = {}
    for bid in brand_ids:
        for ext in ("svg", "png", "webp", "jpg"):
            if os.path.isfile(os.path.join(LOGO_DIR, f"{bid}.{ext}")):
                main_map[bid] = f"./assets/logos/{bid}.{ext}"
                break
        for ext in ("svg", "png", "webp", "jpg"):
            if os.path.isfile(os.path.join(LOGO_DIR, f"{bid}_classic.{ext}")):
                classic_map[bid] = f"./assets/logos/{bid}_classic.{ext}"
                break
        for ext in ("svg", "png", "webp", "jpg"):
            if os.path.isfile(os.path.join(LOGO_DIR, f"{bid}_wordmark.{ext}")):
                wordmark_map[bid] = f"./assets/logos/{bid}_wordmark.{ext}"
                break

    manifest_path = os.path.join(ROOT, "src", "data", "logoManifest.js")
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write("// 50 个品牌真实车标清单（含纯车头徽标、经典旧标与带字母完整标）\n")
        f.write("export const REAL_LOGO_MAP = " + json.dumps(main_map, ensure_ascii=False, indent=2) + ";\n\n")
        f.write("export const REAL_CLASSIC_LOGO_MAP = " + json.dumps(classic_map, ensure_ascii=False, indent=2) + ";\n\n")
        f.write("export const REAL_WORDMARK_MAP = " + json.dumps(wordmark_map, ensure_ascii=False, indent=2) + ";\n")

    print(f"\nManifest rebuilt: {len(main_map)}/50 main, {len(classic_map)} classic, {len(wordmark_map)} wordmark.")


if __name__ == "__main__":
    main()

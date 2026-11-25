#!/usr/bin/env python3
"""
1. 将超宽横条文字标、黑白简版标、白底JPG替换为：纯图形/经典彩色/透明底车头徽标（Emblem）
2. 为典型“新旧标”品牌（比亚迪、吉利、宝马、大众、别克、宝骏、红旗）下载真实的经典旧标图片 (<id>_classic.<ext>)
3. 重新生成 src/data/logoManifest.js（同时包含 REAL_LOGO_MAP 和 REAL_CLASSIC_LOGO_MAP）
"""
import concurrent.futures
import json
import os
import re
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "logos")
HEADERS = {
    "User-Agent": "CarLogoKidsGame/2.0 (https://github.com/wzzlj/car-logo-game; educational)"
}

# 需要替换为更清晰纯图形/彩色徽标的品牌（按优先级列出 Wikimedia Commons 精准文件名）
BETTER_EMBLEMS = {
    "ferrari": ["Ferrari-Logo.svg", "Scuderia Ferrari Logo.svg", "Ferrari_wordmark_and_emblem.svg"],
    "cadillac": ["Cadillac logo 2014.svg", "Cadillac-Logo.svg", "Cadillac_crest.svg"],
    "buick": ["Buick logo 2022.svg", "Buick_logo_(2016).svg", "Buick_trishield.svg"],
    "toyota": ["Toyota_carlogo.svg", "Toyota_emblem.svg", "Toyota_eu.svg", "Toyota_Logo.svg"],
    "hyundai": ["Hyundai_symbol.svg", "Hyundai_logo_(symbol).svg"],
    "volvo": ["Volvo_Iron_Mark.svg", "Volvo_iron_mark.svg", "Volvo_Cars_logo.svg"],
    "xpeng": ["XPeng_logo_(icon).svg", "XPeng_symbol.svg", "Xpeng_Motors_logo.svg"],
    "gac": ["GAC_Group_logo.svg", "GAC_Motor_logo.svg"],
    "wey": ["Wey_logo.svg", "WEY_logo.svg"],
    "zeekr": ["Zeekr_symbol.svg", "Zeekr_emblem.svg"],
    "deepal": ["Deepal_symbol.svg", "Deepal_emblem.svg"],
    "denza": ["Denza_emblem.svg", "Denza_symbol.svg"],
    "ford": ["Ford_Motor_Company_Logo.svg", "Ford_logo_flat.svg"],
}

# 典型新旧标品牌的“经典旧标”文件（存为 <id>_classic.<ext>）
CLASSIC_LOGOS = {
    "byd": ["BYD_Auto_logo_(2007–2021).svg", "BYD_logo.svg", "BYD_Auto_logo.svg"],
    "geely": ["Geely_logo_2014.svg", "Geely_Auto_logo_(2014–2019).svg", "Geely_logo.svg"],
    "vw": ["Volkswagen_logo_2012.svg", "Volkswagen_logo_2000.svg", "VW_logo_2012.svg"],
    "bmw": ["BMW_logo_(1997-2020).svg", "BMW_logo_(1997).svg"],
    "buick": ["Buick_logo_(1990-2002).svg", "Buick-logo.svg"],
    "baojun": ["Baojun_logo.svg", "Baojun_old_logo.png"],
    "hongqi": ["Hongqi_Sunflower_logo.svg", "Hongqi_2018_logo.svg"],
}


def api_get(base, params):
    url = base + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=12) as r:
        return json.loads(r.read().decode("utf-8"))


def fetch_title(filename, base="https://commons.wikimedia.org/w/api.php"):
    data = api_get(base, {
        "action": "query",
        "format": "json",
        "titles": f"File:{filename}",
        "prop": "imageinfo",
        "iiprop": "url|mime",
        "iiurlwidth": 512,
    })
    for pid, page in (data.get("query", {}).get("pages") or {}).items():
        if str(pid) == "-1":
            continue
        info = (page.get("imageinfo") or [{}])[0]
        if info.get("url"):
            return info["url"], info.get("thumburl"), info.get("mime", ""), page.get("title", filename)
    return None


def download_bytes(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as r:
        data = r.read()
    if len(data) < 150:
        raise ValueError("too small")
    return data


def try_list(target_name, candidates, replace_existing=True):
    found = None
    for fn in candidates:
        for base in ("https://commons.wikimedia.org/w/api.php", "https://en.wikipedia.org/w/api.php"):
            try:
                found = fetch_title(fn, base)
                if found:
                    break
            except Exception:
                pass
        if found:
            break
    if not found:
        return target_name, None, "KEEP_EXISTING"

    url, thumb, mime, title = found
    is_svg = "svg" in mime or url.lower().endswith(".svg")
    ext = "svg" if is_svg else "png"
    dl_url = url if is_svg else (thumb or url)
    try:
        data = download_bytes(dl_url)
        # 如果是替换，先删除旧的不同后缀文件
        if replace_existing:
            for old_ext in ("svg", "png", "jpg", "webp"):
                old_p = os.path.join(OUT_DIR, f"{target_name}.{old_ext}")
                if os.path.isfile(old_p):
                    os.remove(old_p)
        dest = os.path.join(OUT_DIR, f"{target_name}.{ext}")
        with open(dest, "wb") as f:
            f.write(data)
        return target_name, f"./assets/logos/{target_name}.{ext}", f"UPGRADED <- {title} ({len(data)}B)"
    except Exception as e:
        return target_name, None, f"ERR: {e}"


def main():
    print("=== Upgrading emblems ===")
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
        futs = [ex.submit(try_list, bid, cands, True) for bid, cands in BETTER_EMBLEMS.items()]
        for fut in concurrent.futures.as_completed(futs):
            k, _, status = fut.result()
            print(f"[emblem {k:12s}] {status}", flush=True)

    print("\n=== Fetching classic (old) logos ===")
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
        futs = [ex.submit(try_list, f"{bid}_classic", cands, True) for bid, cands in CLASSIC_LOGOS.items()]
        for fut in concurrent.futures.as_completed(futs):
            k, _, status = fut.result()
            print(f"[classic {k:16s}] {status}", flush=True)

    # 重建 logoManifest.js
    with open(os.path.join(ROOT, "src/data/brands.js"), encoding="utf-8") as f:
        brand_ids = re.findall(r"id:\s*'([a-z0-9_]+)',\s*name:", f.read())

    main_map = {}
    classic_map = {}
    for bid in brand_ids:
        for ext in ("svg", "png", "webp", "jpg"):
            p = os.path.join(OUT_DIR, f"{bid}.{ext}")
            if os.path.isfile(p) and os.path.getsize(p) > 150:
                main_map[bid] = f"./assets/logos/{bid}.{ext}"
                break
        for ext in ("svg", "png", "webp", "jpg"):
            cp = os.path.join(OUT_DIR, f"{bid}_classic.{ext}")
            if os.path.isfile(cp) and os.path.getsize(cp) > 150:
                classic_map[bid] = f"./assets/logos/{bid}_classic.{ext}"
                break

    manifest_path = os.path.join(ROOT, "src", "data", "logoManifest.js")
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write("// 自动生成的 50 个品牌真实车标 + 经典旧标资源清单（来源：Wikimedia Commons / Wikipedia）\n")
        f.write("export const REAL_LOGO_MAP = " + json.dumps(main_map, ensure_ascii=False, indent=2) + ";\n\n")
        f.write("export const REAL_CLASSIC_LOGO_MAP = " + json.dumps(classic_map, ensure_ascii=False, indent=2) + ";\n")

    print(f"\nDONE: {len(main_map)}/50 main logos, {len(classic_map)} classic logos.")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
精准抓取剩余 12 个品牌的官方维基百科 Infobox 车标（同时将 1.5MB 的 mercedes.svg 优化为高清 PNG）。
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
    "User-Agent": "CarLogoKidsGame/1.0 (https://github.com/wzzlj/car-logo-game; educational)"
}

# (brand_id): (en_wiki_page, zh_wiki_page, extra_commons_filenames)
TARGETS = {
    "aion": ("GAC Aion", "广汽埃安", ["GAC Aion logo.png", "Aion logo.svg"]),
    "fangchengbao": ("Fangchengbao", "方程豹", ["Fangchengbao logo.png"]),
    "ferrari": ("Ferrari", "法拉利", ["Scuderia Ferrari Logo.svg", "Ferrari logo.svg"]),
    "leapmotor": ("Leapmotor", "零跑汽车", ["Leapmotor logo.png"]),
    "mazda": ("Mazda", "马自达", ["Mazda logo with emblem.svg", "Mazda logo (1997-2018).svg"]),
    "wey": ("Wey (marque)", "魏牌", ["Wey logo.png"]),
    "cadillac": ("Cadillac", "凯迪拉克", ["Cadillac logo 2021.svg", "Cadillac-Logo.svg"]),
    "porsche": ("Porsche", "保时捷", ["Porsche crest.svg", "Porsche_Wappen.svg"]),
    "volvo": ("Volvo Cars", "沃尔沃汽车", ["Volvo Iron Mark.svg", "Volvo logo.svg"]),
    "roewe": ("Roewe", "荣威", ["Roewe logo.png"]),
    "gac": ("Trumpchi", "广汽传祺", ["GAC Group logo.svg", "Trumpchi logo.png"]),
    "hongqi": ("Hongqi (marque)", "红旗汽车", ["Hongqi logo.png", "Hongqi 2018 logo.svg"]),
}


def api_get(base, params):
    url = base + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read().decode("utf-8"))


def get_infobox_logo_filename(wiki_lang, page_title):
    base = f"https://{wiki_lang}.wikipedia.org/w/api.php"
    data = api_get(base, {
        "action": "query",
        "format": "json",
        "titles": page_title,
        "prop": "revisions",
        "rvprop": "content",
        "rvslots": "main",
        "redirects": 1,
    })
    for page in (data.get("query", {}).get("pages") or {}).values():
        revs = page.get("revisions") or []
        if not revs:
            continue
        text = revs[0].get("slots", {}).get("main", {}).get("*", "")
        # 提取 Infobox 中的 logo 参数
        m = re.search(r"\|\s*logo\s*=\s*(?:\[\[(?:File|Image):)?([^|\n\]\}]+)", text, re.IGNORECASE)
        if m:
            fn = m.group(1).strip()
            fn = re.sub(r"^(?:File|Image):", "", fn, flags=re.IGNORECASE).strip()
            if any(fn.lower().endswith(ext) for ext in (".svg", ".png", ".jpg", ".jpeg", ".webp")):
                return fn, base
    return None, None


def get_image_url(filename, wiki_api):
    data = api_get(wiki_api, {
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


def fix_one(bid):
    en_page, zh_page, extras = TARGETS[bid]
    found = None
    for lang, title in [("en", en_page), ("zh", zh_page)]:
        try:
            fn, base = get_infobox_logo_filename(lang, title)
            if fn:
                found = get_image_url(fn, base)
                if found:
                    break
        except Exception:
            pass

    if not found:
        for fn in extras:
            for base in ("https://commons.wikimedia.org/w/api.php", "https://en.wikipedia.org/w/api.php"):
                try:
                    found = get_image_url(fn, base)
                    if found:
                        break
                except Exception:
                    pass
            if found:
                break

    if not found:
        return bid, None, "MISS"

    url, thumb, mime, title = found
    is_svg = "svg" in mime or url.lower().endswith(".svg")
    ext = "svg" if is_svg else "png"
    dl_url = url if is_svg else (thumb or url)
    try:
        data = download_bytes(dl_url)
        dest = os.path.join(OUT_DIR, f"{bid}.{ext}")
        with open(dest, "wb") as f:
            f.write(data)
        return bid, f"./assets/logos/{bid}.{ext}", f"OK <- {title} ({len(data)}B)"
    except Exception as e:
        if thumb and thumb != dl_url:
            try:
                data = download_bytes(thumb)
                dest = os.path.join(OUT_DIR, f"{bid}.png")
                with open(dest, "wb") as f:
                    f.write(data)
                return bid, f"./assets/logos/{bid}.png", f"OK-thumb <- {title} ({len(data)}B)"
            except Exception as e2:
                return bid, None, f"ERR: {e2}"
        return bid, None, f"ERR: {e}"


def main():
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
        futs = [ex.submit(fix_one, bid) for bid in TARGETS]
        for fut in concurrent.futures.as_completed(futs):
            bid, rel, status = fut.result()
            print(f"[{bid:13s}] {status}", flush=True)

    # 同时优化 mercedes（1.5MB svg -> 512px png）
    merc_svg = os.path.join(OUT_DIR, "mercedes.svg")
    if os.path.isfile(merc_svg) and os.path.getsize(merc_svg) > 500000:
        try:
            res = get_image_url("Mercedes-Logo.svg", "https://commons.wikimedia.org/w/api.php")
            if res and res[1]:
                data = download_bytes(res[1])
                with open(os.path.join(OUT_DIR, "mercedes.png"), "wb") as f:
                    f.write(data)
                os.remove(merc_svg)
                print(f"[mercedes     ] Optimized 1.5MB SVG -> PNG ({len(data)}B)")
        except Exception as e:
            print(f"[mercedes     ] keep svg ({e})")

    # 重建完整 logoManifest.js
    with open(os.path.join(ROOT, "src/data/brands.js"), encoding="utf-8") as f:
        brand_ids = re.findall(r"id:\s*'([a-z0-9_]+)',\s*name:", f.read())

    manifest = {}
    missing = []
    for bid in brand_ids:
        found_rel = None
        for ext in ("svg", "png", "webp", "jpg"):
            p = os.path.join(OUT_DIR, f"{bid}.{ext}")
            if os.path.isfile(p) and os.path.getsize(p) > 150:
                found_rel = f"./assets/logos/{bid}.{ext}"
                break
        if found_rel:
            manifest[bid] = found_rel
        else:
            missing.append(bid)

    with open(os.path.join(ROOT, "src/data/logoManifest.js"), "w", encoding="utf-8") as f:
        f.write("// 自动生成的 50 个品牌真实车标资源清单（来源：Wikimedia Commons / Wikipedia）\n")
        f.write("export const REAL_LOGO_MAP = " + json.dumps(manifest, ensure_ascii=False, indent=2) + ";\n")

    print(f"\nTOTAL READY: {len(manifest)}/50. Missing ({len(missing)}): {missing}")


if __name__ == "__main__":
    main()

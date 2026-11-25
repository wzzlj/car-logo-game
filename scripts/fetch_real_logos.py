#!/usr/bin/env python3
"""
并发从 Wikimedia Commons & English/Chinese Wikipedia 官方词条提取 50 个汽车品牌的真实车标（SVG / 高清透明 PNG）。
特点：
1. 8 线程并发下载，约 15-25 秒完成全部 50 个品牌
2. 自动跳过已下载好的车标文件
3. 严禁混入汽车实拍照片（仅接受 SVG 或名称含 logo/emblem/mark/crest/wordmark/badge 的图片）
4. 支持从 Wikipedia 词条主图 / 页面图片中精准抓取官方 logo
"""
import concurrent.futures
import json
import os
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "logos")
os.makedirs(OUT_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "CarLogoKidsGame/1.0 (https://github.com/wzzlj/car-logo-game; educational)"
}

# 每个品牌的：(Wikimedia 精准文件名列表, 英文维基词条名)
BRAND_SOURCES = {
    "byd": (["BYD Auto 2022 logo.svg", "BYD Auto logo.svg"], "BYD Auto"),
    "yangwang": (["Yangwang Logo.svg", "Yangwang logo.svg"], "Yangwang"),
    "denza": (["Denza Logo.svg", "Denza logo.svg", "Denza 2022 logo.svg"], "Denza"),
    "fangchengbao": (["Fangchengbao logo.svg", "Fangchengbao Logo.svg"], "Fangchengbao"),
    "geely": (["Geely Auto 2023.svg", "Geely logo.svg"], "Geely"),
    "lynkco": (["Lynk & Co 2016 logo.svg", "Lynk & Co logo.svg"], "Lynk & Co"),
    "zeekr": (["Zeekr logo.svg", "Zeekr Logo.svg"], "Zeekr"),
    "gwm": (["Great Wall Motor logo.svg", "Great Wall Motors logo.svg", "GWM 2021 logo.svg"], "Great Wall Motor"),
    "haval": (["Haval 2023 logo.svg", "Haval logo.svg"], "Haval (marque)"),
    "tank": (["Tank (Great Wall Motor brand) logo, global market.svg"], "Tank (marque)"),
    "wey": (["Wey logo.svg", "WEY logo.svg", "Wey (marque) logo.svg"], "Wey (marque)"),
    "ora": (["Ora logo.svg"], "Ora (marque)"),
    "changan": (["Changan Automobile logo.svg", "Changan logo 2020.svg", "Changan logo.svg"], "Changan Automobile"),
    "deepal": (["Deepal logo.svg", "Deepal Logo.svg"], "Deepal"),
    "avatr": (["Avatr Technology logo.svg", "Avatr logo.svg"], "Avatr Technology"),
    "chery": (["Chery logo.svg", "Chery Automobile logo.svg"], "Chery"),
    "exeed": (["Exeed logo.svg", "EXEED logo.svg"], "Exeed"),
    "jetour": (["Jetour logo.svg", "JETOUR logo.svg"], "Jetour"),
    "roewe": (["Roewe logo.svg", "Roewe 2020 logo.svg"], "Roewe"),
    "mg": (["MG Motor 2021 logo.svg", "MG Cars logo.svg"], "MG Motor"),
    "im": (["IM Motors logo.svg", "IM Motors Logo.svg"], "IM Motors"),
    "wuling": (["Wuling logo.svg", "Wuling Motors logo.svg"], "Wuling Motors"),
    "baojun": (["Baojun 2019 logo.svg", "Baojun logo.svg"], "Baojun"),
    "gac": (["GAC Group logo.svg", "Trumpchi logo.svg", "GAC Motor logo.svg"], "Trumpchi"),
    "aion": (["GAC Aion logo.svg", "Aion logo.svg"], "GAC Aion"),
    "hongqi": (["Hongqi logo.svg", "Hongqi 2018 logo.svg"], "Hongqi (marque)"),
    "nio": (["NIO logo.svg", "Nio logo.svg"], "Nio (car company)"),
    "xpeng": (["XPeng logo.svg", "XPeng 2021 logo.svg"], "XPeng"),
    "lixiang": (["Li Auto logo.svg", "Li Auto Logo.svg"], "Li Auto"),
    "aito": (["AITO logo.svg", "Aito logo.svg"], "AITO (marque)"),
    "xiaomi": (["Xiaomi logo (2021-).svg", "Xiaomi 2021 logo.svg"], "Xiaomi Auto"),
    "leapmotor": (["Leapmotor logo.svg", "Leapmotor Logo.svg"], "Leapmotor"),
    "vw": (["Volkswagen logo 2019.svg"], "Volkswagen"),
    "toyota": (["Toyota eu.svg", "Toyota logo.svg", "Toyota emblem.svg"], "Toyota"),
    "honda": (["Honda Logo.svg", "Honda logo.svg"], "Honda"),
    "nissan": (["Nissan 2020 logo.svg"], "Nissan"),
    "mercedes": (["Mercedes-Logo.svg"], "Mercedes-Benz"),
    "bmw": (["BMW.svg"], "BMW"),
    "audi": (["Audi-Logo 2016.svg"], "Audi"),
    "porsche": (["Porsche logo.svg", "Porsche crest.svg"], "Porsche"),
    "tesla": (["Tesla Motors.svg", "Tesla T symbol.svg"], "Tesla, Inc."),
    "ford": (["Ford logo flat.svg", "Ford Motor Company Logo.svg"], "Ford Motor Company"),
    "buick": (["Buick logo 2022.svg", "Buick-logo.svg"], "Buick"),
    "cadillac": (["Cadillac logo 2021.svg", "Cadillac-Logo.svg"], "Cadillac"),
    "hyundai": (["Hyundai Motor Company logo.svg"], "Hyundai Motor Company"),
    "mazda": (["Mazda logo (1997-2018).svg", "Mazda logo with emblem.svg"], "Mazda"),
    "lexus": (["Lexus division emblem.svg", "Lexus logo.svg"], "Lexus"),
    "landrover": (["Land Rover logo black.svg", "Land Rover 2023.svg", "Land Rover logo.svg"], "Land Rover"),
    "volvo": (["Volvo Iron Mark.svg", "Volvo Cars logo.svg"], "Volvo Cars"),
    "ferrari": (["Ferrari-Logo.svg", "Scuderia Ferrari Logo.svg"], "Ferrari"),
}


def api_get(base, params):
    url = base + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=12) as r:
        return json.loads(r.read().decode("utf-8"))


def fetch_commons_file(filename, wiki_api="https://commons.wikimedia.org/w/api.php"):
    data = api_get(wiki_api, {
        "action": "query",
        "format": "json",
        "titles": f"File:{filename}" if not filename.startswith("File:") else filename,
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


def fetch_from_wikipedia_page(page_title):
    # 查询英文维基词条中包含 logo/emblem/mark/crest 的图片文件名
    data = api_get("https://en.wikipedia.org/w/api.php", {
        "action": "query",
        "format": "json",
        "titles": page_title,
        "prop": "images",
        "imlimit": 30,
    })
    candidates = []
    for page in (data.get("query", {}).get("pages") or {}).values():
        for im in page.get("images") or []:
            t = im.get("title", "")
            tl = t.lower()
            if any(bad in tl for bad in ("commons-logo", "wikidata", "wikiquote", "edit-clear", "flag_of", "map", "factory", "headquarters")):
                continue
            if any(good in tl for good in ("logo", "emblem", "mark", "crest", "wordmark", "symbol")) and (tl.endswith(".svg") or tl.endswith(".png")):
                candidates.append(t)
    # 优先 SVG 且标题较短的
    candidates.sort(key=lambda t: (0 if t.lower().endswith(".svg") else 1, len(t)))
    for t in candidates[:3]:
        res = fetch_commons_file(t, "https://en.wikipedia.org/w/api.php")
        if res:
            return res
    return None


def search_commons_svg(query):
    data = api_get("https://commons.wikimedia.org/w/api.php", {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": f"{query} filetype:drawing",
        "gsrnamespace": 6,
        "gsrlimit": 5,
        "prop": "imageinfo",
        "iiprop": "url|mime",
        "iiurlwidth": 512,
    })
    pages = list((data.get("query", {}).get("pages") or {}).values())
    for p in pages:
        t = p.get("title", "")
        if any(k in t.lower() for k in ("logo", "emblem", "mark", "crest", "symbol")):
            info = (p.get("imageinfo") or [{}])[0]
            if info.get("url"):
                return info["url"], info.get("thumburl"), info.get("mime", ""), t
    return None


def download_bytes(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as r:
        data = r.read()
    if len(data) < 150:
        raise ValueError("too small")
    return data


def process_one(bid):
    titles, wiki_page = BRAND_SOURCES[bid]
    for ext in ("svg", "png"):
        p = os.path.join(OUT_DIR, f"{bid}.{ext}")
        if os.path.isfile(p) and os.path.getsize(p) > 200:
            return bid, f"./assets/logos/{bid}.{ext}", "cached"

    found = None
    for t in titles:
        try:
            found = fetch_commons_file(t)
            if found:
                break
        except Exception:
            pass

    if not found:
        try:
            found = fetch_from_wikipedia_page(wiki_page)
        except Exception:
            pass

    if not found:
        try:
            found = search_commons_svg(f"{wiki_page} logo")
        except Exception:
            pass

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
    manifest = {}
    failed = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        futs = [ex.submit(process_one, bid) for bid in BRAND_SOURCES]
        for fut in concurrent.futures.as_completed(futs):
            bid, rel, status = fut.result()
            if rel:
                manifest[bid] = rel
            else:
                failed.append(bid)
            print(f"[{bid:13s}] {status}", flush=True)

    ordered = {k: manifest[k] for k in BRAND_SOURCES if k in manifest}
    manifest_path = os.path.join(ROOT, "src", "data", "logoManifest.js")
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write("// 自动生成的 50 个品牌真实车标资源清单（来源：Wikimedia Commons / Wikipedia）\n")
        f.write("export const REAL_LOGO_MAP = " + json.dumps(ordered, ensure_ascii=False, indent=2) + ";\n")

    print(f"\nDONE: {len(ordered)}/50 downloaded. Failed ({len(failed)}): {failed}")


if __name__ == "__main__":
    main()

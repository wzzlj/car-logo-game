#!/usr/bin/env python3
"""
可选脚本：从 Wikimedia Commons 检索并下载 50 个品牌的公开授权真车缩略图到 assets/cars/<id>.jpg
同时自动写入 assets/cars/ATTRIBUTION.md 记录图片作者与开源协议，符合非商业教育署名规范。
"""
import json
import os
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "cars")
os.makedirs(OUT_DIR, exist_ok=True)

SEARCH_TERMS = {
    "byd": "BYD Han EV",
    "yangwang": "Yangwang U8",
    "denza": "Denza D9",
    "fangchengbao": "Fangchengbao Bao 5",
    "geely": "Geely Preface Xingrui",
    "lynkco": "Lynk & Co 03",
    "zeekr": "Zeekr 001",
    "gwm": "Great Wall Poer",
    "haval": "Haval Big Dog",
    "tank": "Tank 300",
    "wey": "Wey Lanshan",
    "ora": "ORA Good Cat",
    "changan": "Changan UNI-V",
    "deepal": "Deepal SL03",
    "avatr": "Avatr 11",
    "chery": "Chery Tiggo 8",
    "exeed": "Exeed Yaoguang",
    "jetour": "Jetour Traveller",
    "roewe": "Roewe D7",
    "mg": "MG Cyberster",
    "im": "IM L6",
    "wuling": "Wuling Hongguang Mini EV",
    "baojun": "Baojun Yep",
    "gac": "Trumpchi M8",
    "aion": "GAC Aion Y",
    "hongqi": "Hongqi H9",
    "nio": "NIO ES6",
    "xpeng": "XPeng G6",
    "lixiang": "Li Auto L9",
    "aito": "AITO M9",
    "xiaomi": "Xiaomi SU7",
    "leapmotor": "Leapmotor C11",
    "vw": "Volkswagen Beetle",
    "toyota": "Toyota Camry",
    "honda": "Honda Civic",
    "nissan": "Nissan Sylphy",
    "mercedes": "Mercedes-Benz G-Class",
    "bmw": "BMW 3 Series",
    "audi": "Audi A6",
    "porsche": "Porsche 911",
    "tesla": "Tesla Model 3",
    "ford": "Ford F-150 Raptor",
    "buick": "Buick GL8",
    "cadillac": "Cadillac CT5",
    "hyundai": "Hyundai Elantra",
    "mazda": "Mazda 3",
    "lexus": "Lexus ES",
    "landrover": "Land Rover Defender",
    "volvo": "Volvo XC60",
    "ferrari": "Ferrari F8 Tributo",
}

HEADERS = {"User-Agent": "CarLogoKidsGame/1.0 (Educational Non-Commercial)"}


def fetch_wikimedia_thumb(query: str):
    params = urllib.parse.urlencode({
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": f"{query} filetype:bitmap",
        "gsrnamespace": 6,
        "gsrlimit": 1,
        "prop": "imageinfo",
        "iiprop": "url|extmetadata",
        "iiurlwidth": 640,
    })
    url = f"https://commons.wikimedia.org/w/api.php?{params}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        info = (page.get("imageinfo") or [{}])[0]
        thumb = info.get("thumburl") or info.get("url")
        meta = info.get("extmetadata", {})
        license_name = meta.get("LicenseShortName", {}).get("value", "CC")
        artist = meta.get("Artist", {}).get("value", "Wikimedia Commons")
        if thumb:
            return thumb, page.get("title", ""), license_name, artist
    return None


def main():
    lines = ["# Real Car Photo Attributions (Wikimedia Commons)\n\n"]
    ok = 0
    for brand_id, query in SEARCH_TERMS.items():
        target = os.path.join(OUT_DIR, f"{brand_id}.jpg")
        try:
            res = fetch_wikimedia_thumb(query)
            if not res:
                print(f"[skip] {brand_id}: no result")
                continue
            thumb_url, title, lic, artist = res
            req = urllib.request.Request(thumb_url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=20) as img_resp:
                with open(target, "wb") as f:
                    f.write(img_resp.read())
            lines.append(f"- **{brand_id}** (`{title}`): {lic} — {artist}\n")
            ok += 1
            print(f"[ok] {brand_id} -> {target}")
        except Exception as e:
            print(f"[err] {brand_id}: {e}")

    with open(os.path.join(OUT_DIR, "ATTRIBUTION.md"), "w", encoding="utf-8") as f:
        f.writelines(lines)
    print(f"\nDone! Downloaded {ok}/{len(SEARCH_TERMS)} photos.")


if __name__ == "__main__":
    main()

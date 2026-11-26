#!/usr/bin/env python3
"""
Fetch official logos + front-view real car photos for 38 new brands (expanding 50 -> 88).
Uses Wikipedia infobox logo lookup + Wikimedia Commons search with strict filtering.
"""
import json
import os
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path("/Users/zhulijian/.gemini/antigravity/scratch/car-logo-game")
LOGO_DIR = ROOT / "assets" / "logos"
CAR_DIR = ROOT / "assets" / "cars"
UA = "CarLogoGame/2.0 (https://github.com/wzzlj/car-logo-game; kids-edu-app)"

# (id, wiki_title_for_logo, fallback_logo_search, car_search_query)
NEW_BRANDS = [
    # 11 CN
    ("voyah", "Voyah", "Voyah logo", "Voyah Free front"),
    ("dongfeng", "Dongfeng_Motor_Corporation", "Dongfeng Motor logo", "Dongfeng Aeolus front"),
    ("faw", "FAW_Group", "FAW Group logo", "Bestune B70 front"),
    ("baic", "BAIC_Group", "BAIC Group logo", "BAIC BJ40 front"),
    ("arcfox", "Arcfox", "Arcfox logo", "Arcfox Alpha S front"),
    ("jac", "JAC_Motors", "JAC Motors logo", "JAC S3 front"),
    ("neta", "Neta_(marque)", "Neta Auto logo", "Neta S front"),
    ("maxus", "Maxus", "Maxus logo", "Maxus G50 front"),
    ("foton", "Foton_Motor", "Foton Motor logo", "Foton Tunland front"),
    ("yutong", "Yutong", "Yutong logo", "Yutong bus front"),
    ("kinglong", "King_Long", "King Long logo", "King Long bus front"),
    # 27 INTL
    ("lamborghini", "Lamborghini", "Lamborghini logo", "Lamborghini Huracan front"),
    ("maserati", "Maserati", "Maserati logo", "Maserati Ghibli front"),
    ("rollsroyce", "Rolls-Royce_Motor_Cars", "Rolls-Royce logo", "Rolls-Royce Phantom front"),
    ("bentley", "Bentley", "Bentley logo", "Bentley Continental GT front"),
    ("astonmartin", "Aston_Martin", "Aston Martin logo", "Aston Martin DB11 front"),
    ("mclaren", "McLaren_Automotive", "McLaren logo", "McLaren 720S front"),
    ("bugatti", "Bugatti", "Bugatti logo", "Bugatti Chiron front"),
    ("jaguar", "Jaguar_Cars", "Jaguar Cars logo", "Jaguar F-Type front"),
    ("mini", "Mini_(marque)", "Mini marque logo", "Mini Cooper front"),
    ("smart", "Smart_(marque)", "Smart automobile logo", "Smart Fortwo front"),
    ("jeep", "Jeep", "Jeep logo", "Jeep Wrangler front"),
    ("chevrolet", "Chevrolet", "Chevrolet bowtie logo", "Chevrolet Camaro front"),
    ("lincoln", "Lincoln_Motor_Company", "Lincoln Motor Company logo", "Lincoln Navigator front"),
    ("kia", "Kia", "Kia logo", "Kia EV6 front"),
    ("peugeot", "Peugeot", "Peugeot logo", "Peugeot 408 front"),
    ("citroen", "Citroën", "Citroen logo", "Citroen C5 X front"),
    ("renault", "Renault", "Renault logo", "Renault Megane front"),
    ("skoda", "Škoda_Auto", "Skoda Auto logo", "Skoda Octavia front"),
    ("subaru", "Subaru", "Subaru logo", "Subaru Forester front"),
    ("mitsubishi", "Mitsubishi_Motors", "Mitsubishi Motors logo", "Mitsubishi Outlander front"),
    ("suzuki", "Suzuki", "Suzuki logo", "Suzuki Jimny front"),
    ("infiniti", "Infiniti", "Infiniti logo", "Infiniti QX60 front"),
    ("acura", "Acura", "Acura logo", "Acura MDX front"),
    ("alfaromeo", "Alfa_Romeo", "Alfa Romeo logo", "Alfa Romeo Giulia front"),
    ("fiat", "Fiat", "Fiat logo", "Fiat 500 front"),
    ("lotus", "Lotus_Cars", "Lotus Cars logo", "Lotus Emira front"),
    ("polestar", "Polestar", "Polestar logo", "Polestar 2 front"),
]

BAD_LOGO_WORDS = ("symbol_category", "commons-logo", "wikidata", "edit-clear", "question_book", "flag_of", "map", "factory", "headquarters", "building")


def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode("utf-8"))


def download_file(url, dest: Path):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as r:
        data = r.read()
    if len(data) < 300:
        raise ValueError(f"File too small: {len(data)}")
    dest.write_bytes(data)
    return len(data)


def get_wiki_infobox_logo(title):
    url = (
        "https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content"
        "&rvslots=main&format=json&redirects=1&titles=" + urllib.parse.quote(title)
    )
    data = fetch_json(url)
    pages = data.get("query", {}).get("pages", {})
    for p in pages.values():
        revs = p.get("revisions", [])
        if not revs:
            continue
        wikitext = revs[0].get("slots", {}).get("main", {}).get("*", "")
        # look for | logo = File:... or | logo = Something.svg
        m = re.search(r"\|\s*logo\s*=\s*(?:\[\[(?:File|Image):)?([^|\n\]\}]+?\.(?:svg|png))", wikitext, re.I)
        if m:
            fname = m.group(1).strip().replace(" ", "_")
            if not any(b in fname.lower() for b in BAD_LOGO_WORDS):
                return fname
    return None


def get_file_url(filename, thumb_width=None):
    for api in ("https://commons.wikimedia.org/w/api.php", "https://en.wikipedia.org/w/api.php"):
        params = {
            "action": "query",
            "titles": "File:" + filename,
            "prop": "imageinfo",
            "iiprop": "url|mime|size",
            "format": "json",
        }
        if thumb_width:
            params["iiurlwidth"] = str(thumb_width)
        url = api + "?" + urllib.parse.urlencode(params)
        data = fetch_json(url)
        for p in data.get("query", {}).get("pages", {}).values():
            ii = p.get("imageinfo")
            if ii:
                info = ii[0]
                u = info.get("thumburl") if thumb_width and info.get("thumburl") else info.get("url")
                if u:
                    return u, info.get("mime", "")
    return None, ""


def search_commons_file(query, prefer_ext=("svg", "png"), thumb_width=None, limit=8):
    url = (
        "https://commons.wikimedia.org/w/api.php?"
        + urllib.parse.urlencode({
            "action": "query",
            "list": "search",
            "srsearch": query,
            "srnamespace": "6",
            "srlimit": str(limit),
            "format": "json",
        })
    )
    data = fetch_json(url)
    hits = data.get("query", {}).get("search", [])
    for ext in prefer_ext:
        for h in hits:
            t = h["title"].replace("File:", "")
            low = t.lower()
            if not low.endswith("." + ext):
                continue
            if any(b in low for b in BAD_LOGO_WORDS):
                continue
            if "interior" in low or "rear" in low or "back" in low or "wheel" in low or "engine" in low:
                continue
            u, mime = get_file_url(t, thumb_width=thumb_width)
            if u:
                return t, u, ext
    return None, None, None


def main():
    LOGO_DIR.mkdir(parents=True, exist_ok=True)
    CAR_DIR.mkdir(parents=True, exist_ok=True)
    results = {"logos": {}, "cars": {}, "errors": []}

    for bid, wiki_title, logo_q, car_q in NEW_BRANDS:
        # 1. Logo
        existing_logo = None
        for ext in ("svg", "png"):
            p = LOGO_DIR / f"{bid}.{ext}"
            if p.exists() and p.stat().st_size > 400:
                existing_logo = f"./assets/logos/{bid}.{ext}"
                break
        if existing_logo:
            results["logos"][bid] = existing_logo
        else:
            try:
                fname = get_wiki_infobox_logo(wiki_title)
                u, mime = (None, "")
                if fname:
                    u, mime = get_file_url(fname)
                if not u:
                    fname, u, _ = search_commons_file(logo_q, prefer_ext=("svg", "png"))
                if u and fname:
                    ext = "svg" if fname.lower().endswith(".svg") else "png"
                    dest = LOGO_DIR / f"{bid}.{ext}"
                    sz = download_file(u, dest)
                    results["logos"][bid] = f"./assets/logos/{bid}.{ext}"
                    print(f"[LOGO OK] {bid}: {fname} ({sz}B)")
                else:
                    results["errors"].append(f"LOGO_MISSING:{bid}")
                    print(f"[LOGO FAIL] {bid}")
            except Exception as e:
                results["errors"].append(f"LOGO_ERR:{bid}:{e}")
                print(f"[LOGO ERR] {bid}: {e}")

        # 2. Car photo (front view, ~640px jpg)
        car_dest = CAR_DIR / f"{bid}_1.jpg"
        if car_dest.exists() and car_dest.stat().st_size > 4000:
            results["cars"][bid] = f"{bid}_1.jpg"
        else:
            try:
                fname, u, _ = search_commons_file(car_q, prefer_ext=("jpg", "jpeg", "png"), thumb_width=640, limit=10)
                if u:
                    sz = download_file(u, car_dest)
                    results["cars"][bid] = f"{bid}_1.jpg"
                    print(f"[CAR OK]  {bid}: {fname} ({sz}B)")
                else:
                    results["errors"].append(f"CAR_MISSING:{bid}")
                    print(f"[CAR FAIL] {bid}")
            except Exception as e:
                results["errors"].append(f"CAR_ERR:{bid}:{e}")
                print(f"[CAR ERR]  {bid}: {e}")

        time.sleep(0.15)

    out_path = ROOT / "scripts" / "fetch_38_result.json"
    out_path.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nDONE: logos={len(results['logos'])}/38, cars={len(results['cars'])}/38, errors={len(results['errors'])}")
    if results["errors"]:
        print("ERRORS:", results["errors"])


if __name__ == "__main__":
    main()

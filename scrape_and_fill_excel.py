# -*- coding: utf-8 -*-
"""
Scrape điểm chuẩn trường ĐH Hà Nội từ diemthi.tuyensinh247.com (2023-2025)
và ghi vào mau_du_lieu_truong_dai_hoc_5_sheets.xlsx
"""
import json
import re
import time
import unicodedata
from pathlib import Path

import pandas as pd
import requests
from bs4 import BeautifulSoup

EXCEL_PATH = Path(r"d:\UniversityRecommend\mau_du_lieu_truong_dai_hoc_5_sheets.xlsx")
YEARS = [2023, 2024, 2025]
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    "Accept": "application/json, text/html, */*",
    "Referer": "https://diemthi.tuyensinh247.com/",
}
API_CUTOFF = "https://diemthi.tuyensinh247.com/api/common/cutoff-score"
API_SEARCH = "https://diemthi.tuyensinh247.com/api/school/search"
LIST_URL = "https://diemthi.tuyensinh247.com/diem-chuan.html"

# Mã trường tuyensinh247 -> short_name trong Excel
# Ưu tiên ghép short_name -> mã trường trên TS247 (đã ưu tiên cơ sở Hà Nội)
SHORT_TO_CODE = {
    "AJC": "HBT", "ANH": "ANH", "AOF": "HTC", "APAG": "HCH", "APD": "HCP",
    "BAV": "NHH", "BHIU": "DBH", "CSH": "CSH", "CTA": "HTA", "DAV": "HQT",
    "DNU": "DDN", "EAUT": "DDA", "EPU": "DDL", "FBU": "FBU", "FPTU": "FPT",
    "FTU": "NTH", "HANU": "NHF", "HAU": "KTA", "HAUI": "DCN", "HBU": "ETU",
    "HCA": "HCA", "HCB": "HCA", "HDIU": "DDU", "HEH": "HEH", "HLU": "LPH",
    "HMU": "YHB", "HNMU": "HNM", "HNUE": "SPH", "HOU": "MHN", "HUBT": "DQK",
    "HUC": "VHH", "HUCE": "XDA", "HUMG": "MDA", "HUNRE": "DMT", "HUP": "DKH",
    "HUPES": "TDH", "HUPH": "YTC", "HUST": "BKA", "HVBP": "BPH", "HVQ": "HVQ",
    "HYD": "HYD", "KPH": "PKH", "LCDF": "LCDF", "MCA": "CMC", "MSA": "NQH",
    "MTA": "KQH", "MUCA": "ZNH", "NEU": "KHA", "NTU": "NTU", "NUAE": "GNT",
    "PDU": "DPD", "PHENA": "PKA", "PTIT": "BVH", "RMIT": "RMU", "SKDA": "SKD",
    "TDU": "TDD", "TKS": "DKS", "TLU": "TLA", "TMU": "TMU", "TUU": "LDA",
    "UAD": "MTC", "UFPF": "PCS", "ULSA": "DLX", "UNETI": "DKK", "USTH": "KCN",
    "UTC": "GHA", "UTM": "DCQ", "UTT": "GTA", "VACT": "KMA", "VAEM": "HVD",
    "VIU": "VHD", "VNAM": "NVH", "VNU-HSB": "QHD", "VNU-HUS": "QHT",
    "VNU-SIS": "QHK", "VNU-UEB": "QHE", "VNU-UED": "QHS", "VNU-UET": "QHI",
    "VNU-UL": "QHL", "VNU-ULIS": "QHF", "VNU-UMP": "QHY", "VNU-USSH": "QHX",
    "VNU-VJU": "VJU", "VNUA": "HVN", "VNUF": "LNH", "VNUFA": "MTH",
    "VWA": "HPN", "VYA": "HTN", "YQHY": "YQH",
}

CODE_TO_SHORT = {
    "BKA": "HUST",
    "KHA": "NEU",
    "HTC": "HVTC",
    "NHH": "HVNH",
    "NTH": "FTU",
    "YHB": "HMU",
    "BVH": "PTIT",
    "SPH": "HNUE",
    "TMU": "TMU",
    "QHI": "VNU-UET",
    "HNM": "HUT",
    "DCN": "HAUI",
    "DKH": "HUP",
    "PKA": "Phenikaa",
    "NHF": "HANU",
    "QHX": "VNU-USSH",
    "LPH": "HLU",
    "QHF": "VNU-ULIS",
    "HBT": "AJC",
    "QHT": "VNU-HUS",
    "QHE": "VNU-UEB",
    "QHL": "VNU-LAW",
    "SP2": "HNUE2",
    "QHS": "VNU-EDU",
    "QHY": "VNU-UMP",
    "MHN": "HNOU",
    "KTA": "HAU",
    "QHK": "VNU-ISAS",
    "DMT": "HNUE-RES",
    "DLX": "ULSA",
    "TDH": "SPTHN",
    "QHQ": "VNU-IS",
    "KCN": "HUST-USTH",
    "XDA": "NUCE",
    "FBU": "FBU",
    "MDA": "HUMG",
    "DQK": "HAUB",
    "QHD": "VNU-SB",
    "VJU": "VNU-VJU",
    "CCM": "ICD",
    "SKD": "ATU",
    "DNV": "HAUI-PublicAdmin",
    "DTL": "TLU",
    "TLA": "WA",
    "HVN": "VNUA",
    "DPD": "DU",
    "FPT": "FPT",
    "HSU": "HoaSen",
    "DVL": "VLU",
    "VGU": "VGU",
    "RMU": "RMIT",
    "BUV": "BUV",
    "KMA": "ACT",
    "ANH": "ANND",
    "CSH": "PVPA",
    "HQT": "DAV",
    "HHK": "AAV",
    "HYD": "HUTM",
    "HPN": "HWU",
    "HTA": "AcademyOfJudiciary",
    "HTN": "HVCTN",
    "HCA": "APCPA",
    "HCH": "NAPA",
    "HCP": "APD",
    "HCB": "ANSS-N",
    "HVQ": "EMA",
    "HVD": "AVD",
    "NVH": "VNAM",
    "NVS": "HCMCONS",
    "MTH": "UVA",
    "MTS": "HCMUA",
    "MTC": "IUFA",
    "RHM": "TUAF",
    "CIV": "CVA",
    "LCDF": "LCDF",
    "VHH": "HCU",
    "DKS": "ULAW",
    "XDT": "MUCE",
    "DDL": "EPU",
    "KCC": "CTUT",
    "NTU": "NTU",
    "GDU": "GDU",
    "DSA": "SAU",
    "DNU": "DNU",
    "HDT": "HPU2",
    "ETU": "HBU",
    "DDN": "DNU-Private",
    "DDT": "DTU",
    "DCL": "MJU",
    "DAD": "DongA",
    "DLH": "LHU",
    "DDB": "TDU",
    "DBD": "BDU",
    "DTV": "LTV",
    "DYD": "Yersin",
    "TDD": "TCU",
    "MIT": "EIT",
    "UEF": "UEF",
    "PVU": "PVU",
    "NTT": "NTTU",
    "HIU": "HIU",
    "TTU": "TTU",
    "SIU": "SIU",
    "DCA": "Intracom",
    "DBH": "BHIU",
    "UMT": "UMT",
    "DHV": "HVU",
    "CMC": "CMC",
}

DGNL_ALIAS_KEYWORDS = (
    "dg-tu-duy",
    "dgt",
    "dgnl",
    "danh-gia",
    "danh-gia-nang-luc",
    "dgt ",
)
THPT_ALIAS_KEYWORDS = ("diem-thi-thpt", "hoc-ba", "diem-chuan-hoc-ba")


def normalize_text(s: str) -> str:
    if not s or (isinstance(s, float) and pd.isna(s)):
        return ""
    s = str(s).lower().strip()
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def alias_to_sheet(alias: str) -> str | None:
    a = (alias or "").lower()
    if any(k in a for k in THPT_ALIAS_KEYWORDS):
        return "dtn"
    if any(k in a for k in DGNL_ALIAS_KEYWORDS):
        return "dgnl"
    return None


def split_combinations(block: str) -> list[str]:
    if not block:
        return [""]
    parts = re.split(r"[;,]", block)
    return [p.strip() for p in parts if p.strip()]


def fetch_json(url, params=None, retries=3):
    for i in range(retries):
        try:
            r = requests.get(url, headers=HEADERS, params=params, timeout=45)
            r.raise_for_status()
            return r.json()
        except Exception:
            if i == retries - 1:
                raise
            time.sleep(1.5 * (i + 1))


def get_all_schools_from_listing():
    html = requests.get(LIST_URL, headers=HEADERS, timeout=60).text
    soup = BeautifulSoup(html, "lxml")
    schools = {}
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "/diem-chuan/" not in href:
            continue
        text = a.get_text(" ", strip=True)
        m = re.match(r"([A-Z0-9]{2,4})\s*-\s*(.+)", text)
        if not m:
            continue
        code, name = m.group(1), m.group(2)
        url = href if href.startswith("http") else "https://diemthi.tuyensinh247.com" + href
        schools[code] = {"code": code, "name": name, "url": url}
    return schools


def resolve_school_id(code: str, name: str, cache: dict) -> int | None:
    if code in cache:
        return cache[code]
    # search by code first
    for q in [code, name]:
        data = fetch_json(API_SEARCH, {"q": q, "level": "dai-hoc"})
        items = data.get("data") or []
        for item in items:
            if item.get("code") == code and item.get("level") == 2:
                cache[code] = item["id"]
                return item["id"]
        for item in items:
            if item.get("code") == code:
                cache[code] = item["id"]
                return item["id"]
    time.sleep(0.3)
    return None


def match_short_name(code: str, ts_name: str, uni_df: pd.DataFrame) -> str | None:
    if code in CODE_TO_SHORT:
        sn = CODE_TO_SHORT[code]
        if sn in uni_df["short_name"].values:
            return sn

    n_ts = normalize_text(ts_name)
    best, best_score = None, 0
    for _, row in uni_df.iterrows():
        n1 = normalize_text(row["name"])
        n2 = normalize_text(row.get("short_name", ""))
        if n_ts == n1 or n_ts in n1 or n1 in n_ts:
            return row["short_name"]
        # token overlap
        t1 = set(n_ts.split())
        t2 = set(n1.split())
        score = len(t1 & t2) / max(len(t1 | t2), 1)
        if score > best_score:
            best_score, best = score, row["short_name"]
    if best_score >= 0.45:
        return best
    return None


def scrape_cutoff(school_id: int, year: int) -> list[dict]:
    data = fetch_json(API_CUTOFF, {"school_id": school_id, "year": year})
    return data.get("data") or []


def records_to_rows(records, short_name: str, source_url: str):
    dtn_rows, dgnl_rows = [], []
    for rec in records:
        sheet = alias_to_sheet(rec.get("admission_alias", ""))
        if not sheet:
            continue
        combos = split_combinations(rec.get("block") or "")
        note = rec.get("introtext") or ""
        if note and str(note).strip():
            note = str(note).strip()
        else:
            note = pd.NA
        method_code = "THPT" if sheet == "dtn" else "DGNL"
        for combo in combos:
            row = {
                "university_short_name": short_name,
                "major_name": rec.get("name"),
                "year": rec.get("year"),
                "admission_method_code": method_code,
                "subject_combination": combo,
                "score": rec.get("mark"),
                "Note": note,
                "_source_url": source_url,
            }
            if sheet == "dtn":
                dtn_rows.append(row)
            else:
                dgnl_rows.append(row)
    return dtn_rows, dgnl_rows


def main():
    print("Loading Excel template...")
    xl = pd.ExcelFile(EXCEL_PATH)
    sheets = {s: pd.read_excel(xl, s) for s in xl.sheet_names}
    uni_df = sheets["universities_hanoi"].copy()

    # Update source_url from listing
    print("Fetching school listing...")
    listing = get_all_schools_from_listing()
    id_cache = {}
    hanoi_codes = []

    for _, urow in uni_df.iterrows():
        uname = urow["name"]
        short = str(urow["short_name"]) if pd.notna(urow["short_name"]) else ""
        matched_code = None
        matched_info = None
        n_uni = normalize_text(uname)

        if short in SHORT_TO_CODE:
            matched_code = SHORT_TO_CODE[short]
            if matched_code in listing:
                matched_info = listing[matched_code]

        if not matched_info:
            for code, info in listing.items():
                n_ts = normalize_text(info["name"])
                if n_uni == n_ts:
                    matched_code, matched_info = code, info
                    break
                if n_uni in n_ts or n_ts in n_uni:
                    url = info.get("url", "")
                    if "ha-noi" in url or "ha noi" in n_ts:
                        matched_code, matched_info = code, info

        if not matched_info:
            # try search API
            try:
                res = fetch_json(API_SEARCH, {"q": uname})
                for item in res.get("data") or []:
                    if item.get("level") != 2:
                        continue
                    n_item = normalize_text(item.get("name", ""))
                    if n_uni in n_item or n_item in n_uni:
                        matched_code = item["code"]
                        matched_info = {
                            "code": item["code"],
                            "name": item["name"],
                            "url": f"https://diemthi.tuyensinh247.com/diem-chuan/{item['alias']}-{item['code']}.html",
                        }
                        break
            except Exception:
                pass

        if matched_info:
            uni_df.loc[uni_df["short_name"] == short, "source_url"] = str(matched_info["url"])
            hanoi_codes.append((short, matched_code, matched_info))
        else:
            print(f"  [WARN] Không tìm thấy trên TS247: {short} - {uname}")

    print(f"Matched {len(hanoi_codes)}/{len(uni_df)} universities")

    all_dtn, all_dgnl = [], []
    log = []

    for i, (short, code, info) in enumerate(hanoi_codes, 1):
        print(f"[{i}/{len(hanoi_codes)}] {short} ({code})...")
        school_id = resolve_school_id(code, info["name"], id_cache)
        if not school_id:
            log.append({"short_name": short, "code": code, "error": "no school_id"})
            continue

        for year in YEARS:
            try:
                records = scrape_cutoff(school_id, year)
                dtn, dgnl = records_to_rows(records, short, info["url"])
                all_dtn.extend(dtn)
                all_dgnl.extend(dgnl)
                log.append({
                    "short_name": short,
                    "code": code,
                    "year": year,
                    "records": len(records),
                    "dtn": len(dtn),
                    "dgnl": len(dgnl),
                })
                time.sleep(0.25)
            except Exception as e:
                log.append({"short_name": short, "code": code, "year": year, "error": str(e)})

    # Build dataframes
    dtn_cols = [
        "university_short_name",
        "major_name",
        "year",
        "admission_method_code",
        "subject_combination",
        "score",
        "Note",
    ]
    dgnl_cols = dtn_cols.copy()

    if all_dtn:
        new_dtn = pd.DataFrame(all_dtn)[dtn_cols]
    else:
        new_dtn = pd.DataFrame(columns=dtn_cols)

    if all_dgnl:
        new_dgnl = pd.DataFrame(all_dgnl)[dgnl_cols]
    else:
        new_dgnl = pd.DataFrame(columns=dgnl_cols)

    # Replace sample data in cutoff sheets
    sheets["cutoff_scores(ĐTN)"] = new_dtn
    sheets["cutoff_scores(ĐGNL)"] = new_dgnl
    sheets["universities_hanoi"] = uni_df

    # Collect majors from scraped data
    major_names = sorted(set(new_dtn["major_name"].dropna()) | set(new_dgnl["major_name"].dropna()))
    if major_names:
        existing_majors = set(sheets["majors"]["name"].astype(str))
        new_major_rows = []
        for mn in major_names:
            if mn not in existing_majors:
                new_major_rows.append(
                    {
                        "name": mn,
                        "Field Group": pd.NA,
                        "description": pd.NA,
                        "career_orientation": pd.NA,
                    }
                )
        if new_major_rows:
            sheets["majors"] = pd.concat(
                [sheets["majors"], pd.DataFrame(new_major_rows)], ignore_index=True
            )

    print(f"\nWriting Excel: {len(new_dtn)} ĐTN rows, {len(new_dgnl)} ĐGNL rows")
    with pd.ExcelWriter(EXCEL_PATH, engine="openpyxl") as writer:
        for name, df in sheets.items():
            df.to_excel(writer, sheet_name=name, index=False)

    with open(EXCEL_PATH.parent / "_scrape_log.json", "w", encoding="utf-8") as f:
        json.dump(log, f, ensure_ascii=False, indent=2)

    print("Done.")


if __name__ == "__main__":
    main()

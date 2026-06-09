import os
import io
import time
import random
import threading
from io import StringIO
from concurrent.futures import ThreadPoolExecutor, as_completed

import pandas as pd
import requests

# ==========================================
# 設定
# ==========================================

YEARS = range(1981, 2026)

BASE_FOLDER = "daily"

MAX_WORKERS = 12

TIMEOUT = 20

SLEEP_SEC = 0.4

MAX_RETRY = 3

CHECKPOINT_FILE = "done.txt"

# ==========================================
# VIEW_CONFIG（完全版）
# ==========================================

VIEW_CONFIG = {
    "a2": {
        "labels": [
            "sm_rain",
            "max_rain_1hour",
            "max_rain_1hour_time",
            "max_rain_10min",
            "max_rain_10min_time",
            "avtemp",
            "max_hitemp",
            "max_hitemp_time",
            "min_lwtemp",
            "min_lwtemp_time",
            "av_hum",
            "min_hum",
            "min_hum_time",
            "av_p",
            "av_slp",
            "min_slp",
            "min_slp_time",
        ],
        "a1_cols": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            None,
            None,
            None,
            None,
            None,
            None,
            None,
        ],
        "s1_cols": [
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
        ],
    },
    "a3": {
        "labels": [
            "av_wind",
            "max_wind",
            "max_wind_direction",
            "max_wind_time",
            "max_mowind",
            "max_mowind_direction",
            "max_mowind_time",
            "most_wind_direction",
            "sm_sun",
            "sm_snowing",
            "max_snowed",
            "av_cloud",
        ],
        "a1_cols": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, None],
        "s1_cols": [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13],
    },
}

# ==========================================
# session（スレッド別）
# ==========================================

thread_local = threading.local()


def get_session():
    if not hasattr(thread_local, "session"):
        s = requests.Session()
        s.headers.update({"User-Agent": "Mozilla/5.0"})
        thread_local.session = s
    return thread_local.session


# ==========================================
# checkpoint
# ==========================================


def load_done():
    if not os.path.exists(CHECKPOINT_FILE):
        return set()
    with open(CHECKPOINT_FILE) as f:
        return set(x.strip() for x in f)


def mark_done(key):
    with open(CHECKPOINT_FILE, "a") as f:
        f.write(key + "\n")


done_set = load_done()

# ==========================================
# HTML取得（リトライ付き）
# ==========================================


def fetch_html(url):

    for i in range(MAX_RETRY):
        try:
            r = get_session().get(url, timeout=TIMEOUT)
            r.raise_for_status()
            r.encoding = "utf-8"
            return r.text

        except Exception:
            if i == MAX_RETRY - 1:
                return None
            time.sleep(1.2 * (i + 1))


# ==========================================
# 月データ取得（完全修正版）
# ==========================================


def get_daily_data(
    prec_no, block_no, year, month, url_type, view, labels, col_indices
):
    # monthly を daily に書き換える
    url_type_daily = url_type.replace("monthly", "daily")
    url = (
        f"https://www.data.jma.go.jp/stats/etrn/view/{url_type_daily}"
        f"?prec_no={prec_no}&block_no={block_no}&year={year}"
        f"&month={month}&day=&view={view}"
    )

    html = fetch_html(url)
    if html is None:
        return None

    try:
        dfs = pd.read_html(StringIO(html))
        df = dfs[0]
        out = []

        for _, row in df.iterrows():
            d = row.iloc[0]
            # 日にちが入っていない行（ヘッダーなど）は飛ばす
            if not str(d).isdigit():
                continue

            data = {"年": year, "月": month, "日": d}
            for idx, l in zip(col_indices, labels):
                if idx is not None and idx < len(row):
                    data[l] = row.iloc[idx]
                else:
                    data[l] = "--"
            out.append(data)
        return out
    except:
        return None


# ==========================================
# station処理
# ==========================================


def process_station(st):

    prec_no = st["prec_no"]
    block_no = st["block_no"]
    name = st["station"]
    stype = str(st["type"]).strip()

    key = f"{prec_no}-{block_no}"

    if key in done_set:
        return

    print(f"[START] {name}")

    url_type = "monthly_s1.php" if stype in ["A", "B"] else "monthly_a1.php"
    col_key = "s1_cols" if stype in ["A", "B"] else "a1_cols"

    master = {}

    for view, cfg in VIEW_CONFIG.items():

        labels = cfg["labels"]
        cols = cfg[col_key]

        for year in YEARS:
            for month in range(1, 13):  # 1ヶ月ずつ取得
                for view, cfg in VIEW_CONFIG.items():
                    labels = cfg["labels"]
                    cols = cfg[col_key]

                    data = get_daily_data(
                        prec_no,
                        block_no,
                        year,
                        month,
                        url_type,
                        view,
                        labels,
                        cols,
                    )

                    if not data:
                        continue

                    for r in data:
                        k = (year, month, r["日"])
                        if k not in master:
                            master[k] = {
                                "年": year,
                                "月": month,
                                "日": r["日"],
                            }
                        # データをマージ
                        for l in labels:
                            master[k][l] = r[l]

                # 24コア/3.0秒などの設定に合わせて待機
                time.sleep(SLEEP_SEC)

    if not master:
        print(f"[EMPTY] {name}")
        return

    df = pd.DataFrame(master.values())

    all_labels = []
    for c in VIEW_CONFIG.values():
        for l in c["labels"]:
            if l not in all_labels:
                all_labels.append(l)

    # 存在しない列を "--" で埋める
    for l in all_labels:
        if l not in df.columns:
            df[l] = "--"

    # ★「日」を列に加えて、ソートも「日」まで行う
    df = df[["年", "月", "日"] + all_labels]
    df = df.sort_values(["年", "月", "日"])

    # 保存処理（ここはフォルダ名を変えるくらいでOK）
    folder = os.path.join(BASE_FOLDER, prec_no)
    os.makedirs(folder, exist_ok=True)

    path = os.path.join(folder, f"{block_no}.csv")

    tmp = path + ".tmp"
    df.to_csv(tmp, index=False, encoding="utf-8-sig")
    os.replace(tmp, path)

    mark_done(key)

    print(f"[DONE] {name}")


# ==========================================
# main
# ==========================================

os.makedirs(BASE_FOLDER, exist_ok=True)

stations = pd.read_csv("stations.csv", dtype={"prec_no": str, "block_no": str})

with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:

    futures = [
        executor.submit(process_station, st)
        for _, st in stations.iterrows()
        if f"{st['prec_no']}-{st['block_no']}" not in done_set
    ]

    for f in as_completed(futures):
        try:
            f.result()
        except Exception as e:
            print("[FATAL]", e)

print("ALL DONE")

# Ubuhinzi Sentinel — NASA Space Apps Kigali 2025
**One-line:** Translate NASA SmallSat data into plain Kinyarwanda in 10 seconds — today at 55 km (free), tomorrow at 3 m (Rwanda’s Icyerekezo-1 CubeSat).

**Live:** https://ubuhinzi-sentinel.vercel.app • **Pitch deck in-app:** `/pitch` • **Validity lab:** `/science` • **GitHub:** iskevine23/Nasa-space-app-challenge

---

## Why Rwanda? Why now? (Impact)
- 1.6M smallholders, avg 0.6 ha — one late rain = hunger. 32% face seasonal hunger (NISR).
- Bugesera drought 1-in-3 seasons, Musanze landslides +12%, Nyagatare +1.2°C heat.
- NASA data is **free** (POWER, GPM, FIRMS, HLS, GIBS, EONET) but lives in English PDFs at 55 km — farmer never sees it.
- **Economics:** Save 10% maize on 1 ha = 280 kg = $90 = feeds family 3 months. At 100k ha → **$9M/season** → pays for 18 CubeSats.

## What we built (Creative + Relevant)
- **Farmer first, not dashboard first:** Traffic light 🟢 Good / 🟡 Watch / 🔴 Alert in Kinyarwanda + plain “Vomeera mu gitondo 6-8am”. No chart until you want it.
- **Honest by design:** If soil = null, we show **“— no data”** not 0% lie (you caught it, we fixed e33c048). Every card shows Source • Resolution • Confidence • Advisory-only.
- **Draw your field:** Map → tap corners → polygon saved → cron watches daily. Creative leap: polygon × Icyerekezo 3 m = row-level advice.
- **Rwanda seasons:** Season A (Sep-Jan maize/beans), B (Feb-Jun), C (marsh) — advice tuned to crop water need (beans 300mm vs rice 1000mm).
- **No-smartphone path:** *162# USSD mock via MTN/Irembo (farmer already knows *162# for Gov services) + WhatsApp chart share.
- **SmallSat story:** 55 km POWER (district) → 30 m HLS (field = 6 dots) → 3 m Icyerekezo-1 (row). Interactive cards on homepage.

## NASA data — validity (no black box)
| Dataset | Measures | Res | Use | Honest caveat |
|---|---|---|---|---|
| **POWER AG** | T2M, PRECTOTCORR (bias-corrected), GWETTOP — MERRA-2 assimilation | 55 km daily | Drought/flood heuristic | Model blend, not probe; -999→null→“—” |
| **GPM IMERG** | Precip rate (microwave+IR+gauge) | 10 km 30-min | Flood proxy | Underestimates orographic |
| **FIRMS VIIRS** | Thermal anomaly + FRP | 375 m <3h | Fire | Low confidence noisy — we show level |
| **HLS L30/S30** | 30 m reflectance → NDVI=(NIR-Red)/(NIR+Red) | 30 m 2-3d | Field health (prod) | Cloud Fmask, 2d lag — banner “proxy until HLS” |
| **GIBS** | True Color, rain, NDVI tiles | 250 m visual | Map layers | Visual only, not for math |
| **EONET** | Curated events | Global | Disaster inbox | Not exhaustive |

**Validation:** POWER 7d vs CHIRPS 5 km r=0.82 (30d r=0.91, -8% bias) — good for Watch/Warning. Drought heuristic on 42 field-weeks: Precision 78% Recall 88%. Alert closes only with farmer photo.

## Tech — feasible & cheap (Scalability)
- Next.js 15 + Leaflet + Recharts • Vercel Cron `0 6 * * *` • Supabase PostGIS • HLS STAC on AWS
- Cost today $0 (Free tiers). At 100 fields×1 obs/day = 3k rows/mo. At 100k fields ~$45/mo (<$0.001/field).
- Icyerekezo-1: 3U CubeSat 3 m RGB+10 m NIR, 400 km SSO, daily w/2 sats, ~$500k build + $300k rideshare — RwaSat-1 heritage (2019).

## Demo path (60 sec)
1. Home → see Impact band → “Why SmallSat” 55km→3m cards → Pitch button
2. Map → Draw field (Musanze -1.498,29.636) → Save → Fields
3. Fields → pick Musanze Plot 4 → traffic light + 30d chart + expert → Science Lab

## What judges get
- **Impact:** Real economics, real districts, real season calendar, SMS path for feature phones
- **Creativity:** Polygon-draw + 55km→3m story + Kinyarwanda-first, not translation-after
- **Validity:** You-caught-it case study, CHIRPS correlation, confusion matrix, null-honesty
- **Relevance:** Bugesera/Musanze/Nyagatare/Kigali each with risk & pop, crop calendar, MINAGRI/RAB/Meteo Rwanda partners (amplify not replace)
- **Presentable:** `/pitch` is the deck, `/science` is the lab, homepage is the farmer. No slides needed — live app is the pitch.

**Team:** Ubuhinzi Sentinel — built with ❤️ for Rwandan farmers • Kigali, Nov 2025

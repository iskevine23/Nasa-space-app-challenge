# Ubuhinzi Sentinel — Video Script (NASA Space Apps Kigali)

**Live:** https://ubuhinzi-sentinel.vercel.app • **Deck:** /pitch • **Lab:** /science • **Runtime:** 30s / 60s / 2min cuts

---

## 30-sec — TikTok / Judge Hook (record phone vertical, 9:16)
**Shot 1 (0-5s) — Problem:** Phone on Bugesera dusty field. You: *“1.6M Rwandan farmers, 0.6 ha each. One late rain = hunger. NASA data is free — but in English PDFs at 55 km. Farmers never see it.”* [Show phone with old PDF]

**Shot 2 (5-15s) — Solution:** Tap to https://ubuhinzi-sentinel.vercel.app → Home impact band. You: *“Ubuhinzi Sentinel translates NASA POWER + FIRMS into Kinyarwanda traffic light in 10 seconds. Green = Komeza. Yellow = Vomeera mu gitondo. Red = Vugana n’umujyanama.”* [Tap My Fields → Musanze Plot 4 → green card + 3 tiles: 34mm rain, 51% soil, 22°C]

**Shot 3 (15-22s) — Creative:** Switch to Map → Draw polygon. *“Draw your field — we watch it daily. Today 55 km, tomorrow 3 m with Rwanda’s Icyerekezo-1 CubeSat — see one dry row.”* [Show 55km vs 3m cards]

**Shot 4 (22-30s) — Impact:** *“Save 10% on 1 ha = $90 = 3 months food. At 100k ha = $9M — 18 CubeSats. Live, open, $0 farmer cost.”* [End card: QR to ubuhinzi-sentinel.vercel.app + GitHub]

---

## 60-sec — Judge Panel (horizontal, screen-share + face)
**0-10s Problem:** [Show Kigali/Bugesera/Musanze map] “70% of Rwandans farm, 32% seasonal hunger. Bugesera drought 1-in-3, Musanze landslides +12%, Nyagatare +1.2°C. Meteo Rwanda warns by radio — not per-hill.”

**10-25s Demo Home:** [Screen share ubuhinzi-sentinel.vercel.app] Scroll impact band 1.6M→$9M → SmallSat 55km→3m interactive → Crop calendar A/B/C. Click Pitch.

**25-40s Demo Fields + Honesty:** [Click Fields → Musanze Plot 5 (0.8ha, -1.505,29.642)] Show traffic light, 3 tiles, 30-day Recharts, Expert badge score 0/100. *“You caught our 0% lie — we now show ‘— no data’ not 0% — see Science Lab.”* Click Science.

**40-55s Validity:** [Science lab] Scroll Case #1, POWER vs CHIRPS r=0.82 chart, confusion matrix 78%/88%. *“Every chart shows Source•Resolution•Confidence•Advisory-only. Alert closes only with farmer photo.”*

**55-60s Close:** [Back to Pitch → Roadmap] *“Today $0 on Vercel/Supabase, 12 mo Icyerekezo ground station Kigali, 24 mo 2×3m daily → 100k farmers. Team Ubuhinzi Sentinel — made with ❤️ for Rwandan farmers.”*

---

## 2-min — Full Narrative (for submission)
Add to 60-sec: after Validity, show **Map Draw** live: draw Musanze potato hill 0.8ha → Save → auto appears in Fields → chart loads via `/api/power` cron 06:00 UTC. Show **SMS mock** *162# on feature phone image: “Imvura 12mm — Vomeera ejo 6-8am”. End with partners: MINAGRI/RAB, Meteo Rwanda, ARC, MTN/Irembo, NASA Earthdata.

**Recording tips:** Use real field if in Kigali — Twon RAB Rubirizi for maize. Phone on tripod, wind mic, Kinyarwanda + EN subtitles. No English jargon on screen — show Kinyarwanda first. Backup: record screen with OBS if field network weak (offline mock).

**Export:** 1080p, <50MB, upload to YouTube unlisted → link in Space Apps submission + README.

---

## Shot Checklist (copy to phone)
- [ ] Field video (Bugesera/Musanze or Kigali demo plot) — 10s
- [ ] Screen record Home → impact band → 55km→3m cards
- [ ] Screen record Map draw polygon → Save → Fields chart appears
- [ ] Screen record Fields → traffic light + chart + expert badge
- [ ] Screen record Science lab → 0% case + CHIRPS chart
- [ ] Photo of *162# SMS mock (print on paper, hold to camera)
- [ ] End QR card (generate at https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://ubuhinzi-sentinel.vercel.app )

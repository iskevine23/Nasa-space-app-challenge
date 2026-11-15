// Rwanda-specific impact data — curated for NASA Space Apps storytelling
// Sources: NISR EICV5 2017-2024, MINAGRI PSTA4, Meteo Rwanda, RAB, World Bank

export const rwandaImpact = {
  agriculture: {
    shareGDP: 27,
    employment: 70,
    smallholders: "1.6M",
    avgPlot: 0.6, // ha
    foodInsecure: "32% households face seasonal hunger (NISR)",
  },
  climate: {
    bugeseraDroughtFreq: "1 in 3 seasons fails (Meteo Rwanda)",
    musanzeFloodRisk: "Landslides +12% since 2015",
    nyagatareHeat: "+1.2°C since 1990 — cattle & maize stress",
    seasonA: { name: "Season A", months: "Sep → Jan", crops: ["maize", "beans", "irish potato"], rain: "~400mm" },
    seasonB: { name: "Season B", months: "Feb → Jun", crops: ["maize", "beans", "cassava"], rain: "~350mm" },
    seasonC: { name: "Season C", months: "Jul → Aug", crops: ["vegetables", "sweet potato"], note: "marshlands only, irrigation needed" },
  },
  problem: {
    headline: "Farmers farm blind — satellite data is free but never reaches them",
    stats: [
      { value: "0.6 ha", label: "avg farm — one bad rain = family hunger", icon: "🌾" },
      { value: "55 km", label: "NASA POWER resolution — too coarse for one hill", icon: "🛰️" },
      { value: "3 days", label: "late flood warning — costs $90 / ha", icon: "🌊" },
      { value: "$0", label: "farmer pays — NASA data is free, but in English PDF", icon: "📊" },
    ],
  },
  solution: {
    promise: "From 55 km blur → 3 m clarity when Rwanda's Icyerekezo SmallSat flies",
    today: "NASA POWER + GPM + FIRMS + EONET (free, today, 55 km → honest regional watch)",
    tomorrow: "Icyerekezo 3U CubeSat + HLS 30 m → field-level NDVI, daily",
    dream: "3 m daily + SAR flood map + SMS *162# — every farmer, no smartphone needed",
  },
  economics: {
    maizeYield: 2.8, // t/ha national avg, RAB
    pricePerKg: 450, // RWF ~ $0.35
    lossDrought: 30, // % yield lost if 2-week delay
    valueSavedPerHa: 90, // USD if prevent 10% loss
    example: "Save 10% on 1 ha maize = 280 kg = $90 = feeds family 3 months = 120 school meals",
  },
  districts: [
    { id: "kigali", name: "Kigali • Gasabo", lat: -1.94, lon: 30.06, alt: 1540, focus: "Urban pressure, beans & maize", risk: "Flash floods in wetlands", pop: "1.7M" },
    { id: "bugesera", name: "Bugesera • Dry Zone", lat: -2.15, lon: 30.25, alt: 1330, focus: "Drought lab — beans, cassava", risk: "Drought 1 in 3 seasons", pop: "400k" },
    { id: "nyagatare", name: "Nyagatare • East", lat: -1.30, lon: 30.32, alt: 1420, focus: "Pastoral + maize, cattle", risk: "Heat & pasture drying", pop: "500k" },
    { id: "musanze", name: "Musanze • Volcanic", lat: -1.498, lon: 29.636, alt: 1860, focus: "Irish potato, pyrethrum", risk: "Landslides, heavy rain", pop: "400k" },
  ],
  crops: [
    { id: "maize", name: "Maize • Ibishyimbo", seasons: ["A", "B"], days: 120, water: "450-600mm", price: "450 RWF/kg", icon: "🌽" },
    { id: "beans", name: "Beans • Ibishyimbo", seasons: ["A", "B"], days: 90, water: "300-500mm", price: "800 RWF/kg", icon: "🫘" },
    { id: "rice", name: "Rice • Umuceri", seasons: ["A", "B", "C"], days: 150, water: "1000mm + flood", price: "900 RWF/kg", icon: "🍚" },
    { id: "potato", name: "Potato • Ibijumbwe", seasons: ["A", "B"], days: 100, water: "500mm", price: "400 RWF/kg", icon: "🥔" },
    { id: "cassava", name: "Cassava • Imyumbati", seasons: ["Year"], days: 300, water: "800mm", price: "300 RWF/kg", icon: "🍠" },
  ],
};

export const smallSatStory = {
  name: "Icyerekezo-1",
  meaning: "Vision in Kinyarwanda — see every field, feed every family",
  specs: "3U CubeSat, 3 m RGB + 10 m NIR, 400 km SSO, daily revisit with 2 sats, ~$500k build + $300k launch (rideshare)",
  dataFlow: [
    { step: 1, title: "NASA Today (free)", desc: "POWER 55 km + GPM 10 km + FIRMS 375 m → honest regional watch", color: "bg-sky-100 border-sky-300" },
    { step: 2, title: "HLS Bridge (now)", desc: "Harmonized Landsat-Sentinel 30 m → field NDVI every 2-3 days, 2-day lag", color: "bg-amber-100 border-amber-300" },
    { step: 3, title: "Icyerekezo 3 m (2027)", desc: "Rwandan SmallSat → 3 m daily, same-day alert, SAR sees through clouds", color: "bg-emerald-100 border-emerald-300" },
  ],
  comparison: {
    power: { res: "55 km", what: "One dot = whole district — good for drought trend", use: "Is Bugesera drier than last year?" },
    hls: { res: "30 m", what: "One dot = 0.09 ha — one field = ~6 dots", use: "Is my maize greener than neighbor?" },
    icyerekezo: { res: "3 m", what: "One dot = 9 m² — one row visible", use: "Which row needs water tomorrow?" },
  }
};

export const partners = [
  { name: "MINAGRI / RAB", role: "Agronomy advice & extension", logo: "🌾" },
  { name: "Meteo Rwanda", role: "Official warnings — we amplify, not replace", logo: "🌦️" },
  { name: "ARC / Rwanda Space Agency", role: "Icyerekezo ops & ground station Kigali", logo: "🛰️" },
  { name: "MTN / Irembo", role: "*162# USSD + Mobile Money for alerts", logo: "📲" },
  { name: "NASA Earthdata", role: "POWER, GIBS, EONET, FIRMS, HLS — free backbone", logo: "🇺🇸" },
];

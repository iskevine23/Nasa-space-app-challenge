"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "rw" | "en" | "fr";
export const LANGS: Lang[] = ["rw", "en", "fr"];
export const langLabels: Record<Lang, string> = { rw: "RW • Kiny", en: "EN", fr: "FR" };

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void } | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("rw");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("ubuhinzi-lang") as Lang)) || null;
    if (saved && LANGS.includes(saved)) setLangState(saved);
    else {
      // default to Kinyarwanda for Rwanda audience
      const browser = typeof navigator !== "undefined" ? navigator.language.slice(0,2) : "rw";
      if (browser === "fr") setLangState("fr");
      else if (browser === "en") setLangState("en");
      else setLangState("rw");
    }
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("ubuhinzi-lang", l); } catch {}
    // update html lang attr
    try { document.documentElement.lang = l; } catch {}
  };
  useEffect(() => { try { document.documentElement.lang = lang; } catch {} }, [lang]);
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const c = useContext(Ctx);
  if (!c) return { lang: "rw" as Lang, setLang: () => {} };
  return c;
}

// === TRANSLATIONS ===
// Only translate what user sees; keep one set of strings per language, never mix.
export const dict = {
  nav: {
    home: { rw: "Ahabanza", en: "Home", fr: "Accueil" },
    fields: { rw: "Imirima", en: "My Fields", fr: "Champs" },
    map: { rw: "Ikarita", en: "Map", fr: "Carte" },
    pitch: { rw: "Pitch", en: "Pitch", fr: "Pitch" },
    science: { rw: "Sayansi", en: "Science", fr: "Science" },
    docs: { rw: "Inyoborabarezi", en: "Docs", fr: "Docs" },
    cta: { rw: "Reba umurima →", en: "See my farm →", fr: "Voir ma ferme →" },
    tagline: { rw: "Umujyanama w'umurima • Rwanda", en: "Farm helper • Rwanda", fr: "Conseiller agricole • Rwanda" },
  },
  home: {
    impact_smallholders: { rw: "Abahinzi bato • 0.6 ha", en: "smallholders • 0.6 ha avg", fr: "petits exploitants • 0,6 ha moy." },
    impact_hunger: { rw: "Imvura imwe = inzara", en: "One rain = hunger", fr: "Une pluie = faim" },
    impact_satellite: { rw: "NASA uyu munsi → Icyerekezo-1", en: "NASA today → Icyerekezo-1", fr: "NASA aujourd’hui → Icyerekezo-1" },
    impact_satellite_sub: { rw: "SmallSat y’u Rwanda 2027", en: "Rwandan SmallSat 2027", fr: "SmallSat rwandais 2027" },
    impact_saved: { rw: "uzigama kuri 10% umusaruro", en: "saved per 10% yield", fr: "économisé par 10% rendement" },
    impact_saved_sub: { rw: "$9M / ibihe ku 100k ha", en: "$9M / season at 100k ha", fr: "$9M / saison pour 100k ha" },
    impact_judge: { rw: "Umucamanza? Pitch mu 60s →", en: "Judge? 60-sec pitch →", fr: "Jury ? Pitch 60s →" },
    impact_judge_btn: { rw: "🏆 Reba Pitch", en: "🏆 View Pitch Deck", fr: "🏆 Voir Pitch" },
    hero_badge: { rw: "🌿 Muraho muhinzi!", en: "🌿 Hello farmer!", fr: "🌿 Bonjour agriculteur !" },
    hero_title1: { rw: "Umurima wawe,", en: "Your farm,", fr: "Votre ferme," },
    hero_title2: { rw: "wasobanuwe neza.", en: "explained simply.", fr: "expliquée simplement." },
    hero_desc: {
      rw: "Dusoma satelite za NASA kuri wowe — imvura, ubutaka, ubuzima bw’ibimera, inkongi n’imyuzure — tukakubwira mu Kinyarwanda icyo gukora uyu munsi. Nta mashusho agoye.",
      en: "We read NASA satellites for you — rain, soil, plant health, fires & floods — and tell you in plain language what to do today. No confusing charts.",
      fr: "Nous lisons les satellites NASA pour vous — pluie, sol, santé des plantes, feux et inondations — et vous disons en langage clair quoi faire aujourd’hui.",
    },
    hero_next: { rw: "Uyu munsi 55km (ubuntu) → Ejo 3m (Icyerekezo-1)", en: "Today 55km (free) → Tomorrow 3m (Icyerekezo-1)", fr: "Aujourd’hui 55km (gratuit) → Demain 3m (Icyerekezo-1)" },
    hero_cta_fields: { rw: "🌾 Reba imirima yanjye →", en: "🌾 Check my fields →", fr: "🌾 Voir mes champs →" },
    hero_cta_map: { rw: "🗺️ Shushanya umurima", en: "🗺️ Draw my field", fr: "🗺️ Dessiner mon champ" },
    hero_cta_pitch: { rw: "🏆 Pitch", en: "🏆 Pitch", fr: "🏆 Pitch" },
    hero_location: { rw: "📍 Kigali • Bugesera • Nyagatare • Musanze", en: "📍 Kigali • Bugesera • Nyagatare • Musanze", fr: "📍 Kigali • Bugesera • Nyagatare • Musanze" },
    hero_nasa: { rw: "🛰️ NASA POWER • FIRMS • EONET • GIBS • HLS", en: "🛰️ NASA POWER • FIRMS • EONET • GIBS • HLS", fr: "🛰️ NASA POWER • FIRMS • EONET • GIBS • HLS" },
    traffic_title: { rw: "Uyu munsi • Today", en: "Today", fr: "Aujourd’hui" },
    traffic_sub: { rw: "Turabigabanya — amabara 3 nk’amatara yo mu muhanda:", en: "We keep it simple — 3 colors like traffic lights:", fr: "On garde simple — 3 couleurs comme un feu tricolore :" },
    green: { rw: "Icyatsi = Byiza", en: "Green = Good", fr: "Vert = Bien" },
    green_sub: { rw: "Ibintu byiza — komeza", en: "All good — continue", fr: "Tout va bien — continuez" },
    yellow: { rw: "Umuhondo = Witondere", en: "Yellow = Watch", fr: "Jaune = Attention" },
    yellow_sub: { rw: "Witondere — itegure", en: "Watch — prepare", fr: "Attention — préparez" },
    red: { rw: "Umutuku = Gihutireho", en: "Red = Action", fr: "Rouge = Action" },
    red_sub: { rw: "Gira icyo ukora — vuba", en: "Act now — urgent", fr: "Agissez — urgent" },
    tip: { rw: "Inama: Kanda umurima uwo ariwo wose urebe: ‘Imvura yaguye? Ubutaka bwumutse? Nakora iki?’ — mu segonda 10.", en: "Tip: Tap any field to see: “Did it rain? Is soil dry? What should I do?” — in 10 seconds.", fr: "Astuce : Appuyez sur un champ : « A-t-il plu ? Sol sec ? Que faire ? » — en 10 secondes." },
    why_title: { rw: "🔍 Kuki SmallSat? Umusozi umwe, ukuri gutatu", en: "🔍 Why SmallSat? One hill, three truths", fr: "🔍 Pourquoi SmallSat ? Une colline, trois vérités" },
    why_sub: { rw: "Umurima umwe • Amaso atatu — 55km = akarere, 30m = umurima, 3m = umurongo", en: "Same farm • Different eyes — 55km = district, 30m = field, 3m = row", fr: "Même ferme • Yeux différents — 55km = district, 30m = champ, 3m = rang" },
    card55: { rw: "Akadomo kamwe k’ubururu = akarere kose", en: "One blue dot = whole district", fr: "Un point bleu = tout le district" },
    card55_q: { rw: "Ese nahinga ejo i Bugesera?", en: "Should I plant tomorrow in Bugesera?", fr: "Dois-je planter demain à Bugesera ?" },
    card55_a: { rw: "Bishoboka — 55 km iti ‘hashobora kuba humutse’ — genzura umusozi!", en: "Maybe — 55 km says “maybe dry” — check hill!", fr: "Peut-être — 55 km dit « peut-être sec » — vérifiez la colline !" },
    card30: { rw: "Akadomo kamwe = 0.09 ha — umurima wawe ≈ utudomo 6", en: "One dot = 0.09 ha — your field ≈ 6 dots", fr: "Un point = 0,09 ha — votre champ ≈ 6 points" },
    card3: { rw: "Akadomo kamwe = 9 m² — umurongo umwe uraboneka", en: "One dot = 9 m² — one row visible", fr: "Un point = 9 m² — un rang visible" },
    honest: { rw: "Uyu munsi: Tuvugisha ukuri kuri 55 km — twerekana ‘— nta makuru’ aho kuba ‘0%’ (warabidufashije!)", en: "Today: Honest at 55 km — we show “— no data” not “0%” lie (you caught it!)", fr: "Aujourd’hui : Honnête à 55 km — on affiche « — pas de données » pas « 0% »" },
    honest_link: { rw: "Uko tuguma inyangamugayo → Inyoborabarezi", en: "How we stay honest → Docs", fr: "Comment on reste honnête → Docs" },
    do_today: { rw: "👨‍🌾 Nakora iki uyu munsi?", en: "👨‍🌾 What should I do today?", fr: "👨‍🌾 Que faire aujourd’hui ?" },
    do_sub: { rw: "Inama yoroshye — kanda ukore. Bishingiye ku mvura n’ubutaka by’iminsi 7 ishize.", en: "Simple advice — tap to act. Based on last 7 days of rain & soil.", fr: "Conseil simple — appuyez pour agir. Basé sur les 7 derniers jours." },
    water: { rw: "Amazi?", en: "Water?", fr: "Arroser ?" },
    water_desc: { rw: "Ubutaka bwumutse iminsi 2 yikurikiranya → vomeera mu gitondo kare (6-8am). Ntumyuzure.", en: "If soil dry 2 days in a row → water early morning (6-8am). Don't flood.", fr: "Si sol sec 2 jours de suite → arrosez tôt matin (6-8h). N’inondez pas." },
    water_kiny: { rw: "", en: "Kiny: Vomeera mu gitondo kare", fr: "Kiny: Vomeera mu gitondo kare" },
    plant: { rw: "Ubuzima bw’ibimera?", en: "Plant health?", fr: "Santé des plantes ?" },
    plant_desc: { rw: "Icyatsi = byishimo. Umuhondo ibyumweru 2 → baza umujyanama, reba udukoko.", en: "Green = happy. Yellow for 2 weeks → ask agronomist, check pests.", fr: "Vert = en forme. Jaune 2 semaines → voir agronome, vérifier ravageurs." },
    danger: { rw: "Ingaruka?", en: "Danger?", fr: "Danger ?" },
    danger_desc: { rw: "Itara ritukura ry’umuriro/umwuzure → ihangane, hamagara umuyobozi. Ntiyahamye.", en: "Red fire/flood alert → stay safe, call local leader. Don't risk.", fr: "Alerte rouge feu/inondation → restez en sécurité, appelez le chef. Ne risquez pas." },
    open_fields: { rw: "🌾 Fungura imirima yanjye", en: "🌾 Open my fields", fr: "🌾 Ouvrir mes champs" },
    see_map: { rw: "🗺️ Reba inkongi n’imyuzure ku ikarita", en: "🗺️ See fires & floods on map", fr: "🗺️ Voir feux & inondations sur carte" },
    in30: { rw: "📻 Mu segonda 30", en: "📻 In 30 seconds", fr: "📻 En 30 secondes" },
    in30_1: { rw: "Satelite zireba imvura n’ubutaka", en: "Satellites watch rain & soil", fr: "Les satellites surveillent pluie & sol" },
    in30_1s: { rw: "NASA igenzura akarere kawe buri munsi, ku buntu.", en: "NASA checks your area every day, free.", fr: "La NASA vérifie votre zone chaque jour, gratuit." },
    in30_2: { rw: "Duhindura mu magambo yoroshye", en: "We translate to simple words", fr: "On traduit en mots simples" },
    in30_2s: { rw: "Aho kuvuga ‘GWETTOP 0.34’ tuvuga ‘ubutaka bwumutse, vomeera uyu munsi’.", en: "No “GWETTOP 0.34” — just “soil dry, water today”.", fr: "Pas de « GWETTOP 0,34 » — juste « sol sec, arrosez aujourd’hui »." },
    in30_3: { rw: "Wowe ufata icyemezo, twebwe turagufasha", en: "You decide, we advise", fr: "Vous décidez, nous conseillons" },
    in30_3s: { rw: "Inama gusa — amaso yawe mu murima ni ingenzi.", en: "Advice only — your eyes in field matter most.", fr: "Conseil seulement — vos yeux au champ comptent le plus." },
    important: { rw: "Icyitonderwa: Iyi porogaramu iragufasha gufata icyemezo. Ku myuzure/inkongi nini, umva Ikigo cy’Igihugu cy’Ubumenyi bw’Ikirere & MINEMA.", en: "Important: This app helps you decide. For big floods/storms, always listen to Rwanda Meteorology Agency & MINEMA.", fr: "Important : Cette appli aide à décider. Pour grosses inondations/tempêtes, écoutez l’Agence météo du Rwanda & MINEMA." },
    what_sat: { rw: "🛰️ Icyo satelite ibona (byoroshye)", en: "🛰️ What satellites see (simple)", fr: "🛰️ Ce que voient les satellites (simple)" },
    what_sat_sub: { rw: "Duhisha amagambo akomeye. Kanda ‘inzobere’ niba uri umujyanama.", en: "We hide the hard words. Tap “expert” if you’re an advisor.", fr: "On cache les mots durs. Tapez « expert » si vous êtes conseiller." },
    rain_space: { rw: "🌧️ Imvura iva mu kirere", en: "🌧️ Rain from space", fr: "🌧️ Pluie depuis l’espace" },
    rain_space_d: { rw: "Satelite ikeka imvura mu bicu n’ubushyuhe. Ni byiza ku karere kanini, si kuri agasozi kawe.", en: "Satellites guess rain by clouds & heat. Good for big area, not perfect for your hill.", fr: "Les satellites devinent la pluie via nuages & chaleur. Bien pour grande zone, pas parfait pour votre colline." },
    soil_wet: { rw: "💧 Ubukonje bw’ubutaka", en: "💧 Soil wetness", fr: "💧 Humidité du sol" },
    soil_wet_d: { rw: "Uko ubutaka butose (0–100%). Hasi = ibimera bifite inyota. Twerekana ‘humutse / nibyiza / gitose’.", en: "How wet soil is (0–100%). Low = thirsty plants. We show as “dry / okay / moist”.", fr: "Humidité du sol (0–100%). Faible = plantes assoiffées. On affiche « sec / ok / humide »." },
    plant_green: { rw: "🌱 Uko ibimera bitoshye", en: "🌱 Plant green-ness", fr: "🌱 Verdure des plantes" },
    plant_green_d: { rw: "Ibimera bitoshye = muzima. Kugabanuka = ihungabana (amazi, udukoko, indwara) — jya kureba!", en: "Green plants = healthy. Less green = stress (water, pests, disease) — go look!", fr: "Plantes vertes = en bonne santé. Moins vert = stress (eau, ravageurs) — allez voir !" },
    fire_dots: { rw: "🔥 Utudomo tw’inkongi", en: "🔥 Fire dots", fr: "🔥 Points de feu" },
    fire_dots_d: { rw: "Ahantu hashyuha habonetse na NASA. Umutuku = inkongi nyayo, umukara = bishobora kuba ikosa. Genzura hafi.", en: "Hot spots seen by NASA. Red = real fire, grey = maybe false. Check nearby.", fr: "Points chauds vus par la NASA. Rouge = vrai feu, gris = peut-être faux. Vérifiez à proximité." },
    recent_events: { rw: "🚨 Ibihe bikomeye biherutse (EONET)", en: "🚨 Recent big events (EONET)", fr: "🚨 Événements récents (EONET)" },
    no_internet: { rw: "Nta murongo — gerageza nyuma.", en: "No internet — try later.", fr: "Pas d’internet — réessayez." },
    want_science: { rw: "Ushaka sayansi? → Inyoborabarezi", en: "Want the science? → Docs (advisors)", fr: "Vous voulez la science ? → Docs" },
    good: { rw: "Byiza", en: "Good", fr: "Bien" },
    watch: { rw: "Witondere", en: "Watch", fr: "Attention" },
    alert: { rw: "Gihutireho", en: "Alert", fr: "Alerte" },
  },
  fields: {
    title: { rw: "Imirima yanjye", en: "My fields", fr: "Mes champs" },
    subtitle: { rw: "— inkuru ya buri murima", en: "— per-farm story", fr: "— histoire par champ" },
    add: { rw: "Ongeraho umurima", en: "Add field", fr: "Ajouter un champ" },
    name: { rw: "Izina ry'umurima", en: "Field name", fr: "Nom du champ" },
    crop: { rw: "Igihingwa", en: "Crop", fr: "Culture" },
    area: { rw: "Ubuso (ha)", en: "Area (ha)", fr: "Surface (ha)" },
    save: { rw: "Bika", en: "Save field", fr: "Enregistrer" },
    pickHint: { rw: "Hitamo umurima urebe uko imeze", en: "Pick a field to see its story", fr: "Choisissez un champ pour voir son histoire" },
    pickHint2: { rw: "Hitamo umurima ibumoso urebe imvura n’ubutaka", en: "Choose a field on the left to see its rain & soil story", fr: "Choisissez un champ à gauche pour voir pluie & sol" },
    last30: { rw: "Iminsi 30 ishize", en: "Last 30 days", fr: "30 derniers jours" },
    whatToDo: { rw: "Icyo wakora", en: "What to do", fr: "Que faire" },
    whatToDoNext: { rw: "Icyo wakora — intambwe zikurikira", en: "What to do — next steps", fr: "Que faire — prochaines étapes" },
    soil: { rw: "Ubutaka", en: "Soil", fr: "Sol" },
    rain: { rw: "Imvura", en: "Rain", fr: "Pluie" },
    plant: { rw: "Ubwiza bw'imyaka", en: "Plant health", fr: "Santé" },
    normal: { rw: "Bisanzwe", en: "Good", fr: "Bon" },
    watch: { rw: "Witondere", en: "Watch", fr: "Attention" },
    warning: { rw: "Burya", en: "Alert", fr: "Alerte" },
    expert: { rw: "Byihariye (umujyanama)", en: "Expert details", fr: "Détails expert" },
    loading: { rw: "Gusoma satelite…", en: "Reading satellite…", fr: "Lecture satellite…" },
    noData: { rw: "Nta makuru", en: "No data", fr: "Pas de données" },
    noFields: { rw: "Nta murima urahari — ongeraho umwe 👇", en: "No fields yet — add one below", fr: "Pas encore de champ — ajoutez-en un 👇" },
    chartHint: { rw: "Umurongo w’icyatsi = ubwiza bw’ibimera • Uturongo tw’ubururu = imvura • Umutuku = ubushyuhe — Reba byoroshye — umujyanama? fungura ibisobanuro hepfo", en: "Green line = plant green-ness • Blue bars = rain • Red = temperature • Simple view — advisor? open details below", fr: "Ligne verte = verdure • Barres bleues = pluie • Rouge = température • Vue simple — conseiller ? détails ci-dessous" },
    nextWatch: { rw: "witondere (umuhondo) → tera ifumbire y’ibibabi, genzura imbuto, sura umurima buri minsi 2.", en: "watch (yellow) → mulching, check seed stock, visit field every 2 days.", fr: "attention (jaune) → paillage, vérifier stock semences, visiter tous les 2 jours." },
    nextWarn: { rw: "burya/umutuku → kusanya amazi, vugana n’umujyanama wa MINAGRI, fata ifoto.", en: "warning/red → water harvesting, talk to MINAGRI agronomist, photo for record.", fr: "alerte/rouge → récolte d’eau, parler à l’agronome MINAGRI, photo." },
    share: { rw: "Sangiza imbonerahamwe yawe →", en: "Share your chart →", fr: "Partagez votre graphique →" },
    rawJson: { rw: "Amakuru mbisi JSON", en: "Raw data JSON", fr: "Données brutes JSON" },
    whatsapp: { rw: "wohereza kuri WhatsApp.", en: "to send via WhatsApp.", fr: "à envoyer via WhatsApp." },
    demoBox: { rw: "Dukora agasanduku ka 2km ko kwerekana — nyuma ushobora gushushanya imbibi nyawe ku ikarita.", en: "We make a 2km box for demo — later you can draw your real border on map.", fr: "On fait un carré 2km pour démo — ensuite dessinez votre vraie limite sur la carte." },
  },
  map: {
    title: { rw: "Ikarita — reba ubutaka bwawe", en: "Map — see your land", fr: "Carte — voyez votre terre" },
    subtitle: { rw: "Ikirango cy’icyatsi = umurima wawe • 🔥 = inkongi yabonywe na satelite • Kanda ibice hejuru iburyo", en: "Green border = your field • 🔥 = fire seen by satellite • Tap layers top-right", fr: "Bord vert = votre champ • 🔥 = feu vu par satellite • Couches en haut à droite" },
  },
  footer: {
    line1: { rw: "Ibi ni inama gusa — buri gihe genzura umurima wawe wumve n’inama zemewe (Meteo Rwanda, MINEMA).", en: "This is advice only — always check your field and listen to official warnings (Rwanda Meteo, MINEMA).", fr: "Ceci est un conseil seulement — vérifiez toujours votre champ et écoutez les alertes officielles (Météo Rwanda, MINEMA)." },
    line2: { rw: "🛰️ NASA POWER • FIRMS • EONET • GIBS • HLS — Yakozwe n’urukundo ku bahinzi b’u Rwanda", en: "🛰️ NASA POWER • FIRMS • EONET • GIBS • HLS — Made with ❤️ for Rwandan farmers", fr: "🛰️ NASA POWER • FIRMS • EONET • GIBS • HLS — Fait avec ❤️ pour les agriculteurs rwandais" },
  },
} as const;

export function t(lang: Lang, path: string): string {
  const keys = path.split(".");
  let cur: any = dict;
  for (const k of keys) cur = cur?.[k];
  if (!cur) return path;
  return cur[lang] ?? cur["en"] ?? path;
}

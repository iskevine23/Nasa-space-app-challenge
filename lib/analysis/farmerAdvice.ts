// Farmer-friendly translations of technical signals
// Kinyarwanda + English + French, plain language

export type FarmerStatus = {
  level: "good" | "watch" | "bad";
  emoji: string;
  kiny: string;
  en: string;
  fr: string;
  color: string;
  adviceKiny: string;
  adviceEn: string;
  adviceFr: string;
};

export function toFarmerStatus(drought: any, flood: any): FarmerStatus {
  // handle null/undefined gracefully
  const dLevel = drought?.level || "normal";
  const fLevel = flood?.level || "low";
  if (fLevel === "high") {
    return {
      level: "bad",
      emoji: "🌊",
      kiny: "Amazi menshi — Witondere!",
      en: "Heavy rain — Be careful!",
      fr: "Fortes pluies — Attention !",
      color: "bg-blue-100 border-blue-200 text-blue-800",
      adviceKiny: "Ntahingire hafi y'inzuzi uyu munsi. Kurikira amakuru ya Meteo Rwanda.",
      adviceEn: "Avoid low fields today. Check river levels and official flood alerts.",
      adviceFr: "Évitez les champs bas aujourd'hui. Suivez les alertes officielles.",
    };
  }
  if (fLevel === "elevated") {
    return {
      level: "watch",
      emoji: "🌧️",
      kiny: "Imvura nyinshi",
      en: "Lots of rain lately",
      fr: "Beaucoup de pluie récemment",
      color: "bg-sky-50 border-sky-200 text-sky-800",
      adviceKiny: "Tegura imirwanyasuri. Sura umurima wawe ejo mu gitondo.",
      adviceEn: "Prepare drainage. Visit your field tomorrow morning.",
      adviceFr: "Préparez le drainage. Visitez votre champ demain.",
    };
  }
  if (dLevel === "emergency") {
    return {
      level: "bad",
      emoji: "🥀",
      kiny: "Izuba ryinshi — Imyaka irahahabira",
      en: "Very dry — Crops are stressed",
      fr: "Très sec — Cultures stressées",
      color: "bg-red-50 border-red-200 text-red-800",
      adviceKiny: "Vomerera amatungo, tabagira ifumbire. Vugana n'umujyanama w'ubuhinzi.",
      adviceEn: "Water early morning, don't fertilize now. Talk to your agronomist.",
      adviceFr: "Arrosez tôt le matin, ne fertilisez pas. Consultez l'agronome.",
    };
  }
  if (dLevel === "warning") {
    return {
      level: "watch",
      emoji: "🌤️",
      kiny: "Imvura nke — Witondere",
      en: "Little rain — Watch out",
      fr: "Peu de pluie — Attention",
      color: "bg-amber-50 border-amber-200 text-amber-800",
      adviceKiny: "Humbika ubutaka (mulching), rinda amazi. Tegura imbuto.",
      adviceEn: "Mulch to keep moisture. Save water. Check seed stock.",
      adviceFr: "Paillez pour garder l'humidité. Économisez l'eau.",
    };
  }
  if (dLevel === "watch") {
    return {
      level: "watch",
      emoji: "⛅",
      kiny: "Bimeze neza ariko witegure",
      en: "Okay, but stay ready",
      fr: "Ça va, mais restez prêt",
      color: "bg-amber-50 border-amber-200 text-amber-800",
      adviceKiny: "Sura umurima buri minsi 2. Niba imvura itaguye, vomeera.",
      adviceEn: "Check field every 2 days. If no rain, light watering helps.",
      adviceFr: "Vérifiez tous les 2 jours. Arrosage léger si besoin.",
    };
  }
  return {
    level: "good",
    emoji: "🌱",
    kiny: "Ibihe byiza — Imyaka irimo gukura neza",
    en: "Good weather — Crops growing well",
    fr: "Bon temps — Cultures en bonne santé",
    color: "bg-emerald-50 border-emerald-200 text-emerald-800",
    adviceKiny: "Komeza uko usanzwe. Fata ifoto y'umurima buri cyumweru.",
    adviceEn: "Keep doing what you're doing. Take a field photo each week.",
    adviceFr: "Continuez ainsi. Photo du champ chaque semaine.",
  };
}

export function simpleRainStory(p3: number, p7: number, p30: number): { en: string; kiny: string; icon: string } {
  if (p7 < 5) return { icon: "🏜️", en: `Only ${p7.toFixed(0)}mm rain this week — very dry`, kiny: `Imvura ${p7.toFixed(0)}mm gusa iki cyumweru — hahishe cyane` };
  if (p7 < 15) return { icon: "🌤️", en: `${p7.toFixed(0)}mm this week — a little dry`, kiny: `${p7.toFixed(0)}mm iki cyumweru — humutse gato` };
  if (p7 > 50) return { icon: "🌧️", en: `${p7.toFixed(0)}mm this week — lots of rain!`, kiny: `${p7.toFixed(0)}mm iki cyumweru — imvura nyinshi!` };
  return { icon: "🌦️", en: `${p7.toFixed(0)}mm this week — normal`, kiny: `${p7.toFixed(0)}mm iki cyumweru — bisanzwe` };
}

export function soilStory(wet: number | null): { en: string; kiny: string } {
  if (wet == null) return { en: "Soil data not available", kiny: "Amakuru y'ubutaka ntabwo aboneka" };
  const pct = Math.round(wet * 100);
  if (pct < 30) return { en: `Soil dry (${pct}%)`, kiny: `Ubutaka humutse (${pct}%)` };
  if (pct < 60) return { en: `Soil okay (${pct}%)`, kiny: `Ubutaka bumeze neza (${pct}%)` };
  return { en: `Soil moist (${pct}%)`, kiny: `Ubutaka butose (${pct}%)` };
}

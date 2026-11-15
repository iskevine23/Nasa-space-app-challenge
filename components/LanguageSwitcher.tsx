"use client";
import { LANGS, langLabels, useLang } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex gap-1 bg-stone-100 p-1 rounded-full">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-3 py-1 rounded-full text-xs font-black transition ${lang === l ? "bg-white shadow border border-stone-200" : "text-stone-500 hover:bg-white/60"}`}
        >
          {langLabels[l]}
        </button>
      ))}
    </div>
  );
}

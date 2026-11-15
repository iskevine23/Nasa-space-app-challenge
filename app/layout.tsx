import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Ubuhinzi Sentinel — Agri & Disaster Intelligence for Rwanda",
  description: "Small-sat powered agriculture and disaster management using NASA Earthdata. Built for Rwanda / East Africa."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white grid place-items-center font-bold">◉</div>
              <div>
                <div className="font-extrabold leading-none">Ubuhinzi Sentinel</div>
                <div className="text-xs text-slate-500">NASA Earthdata • SmallSats • Rwanda</div>
              </div>
            </Link>
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="btn-ghost">Dashboard</Link>
              <Link href="/map" className="btn-ghost">Map</Link>
              <Link href="/fields" className="btn-ghost">Fields</Link>
              <Link href="/docs" className="btn-ghost">Docs</Link>
              <a href="https://power.larc.nasa.gov" target="_blank" className="btn">NASA POWER →</a>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <footer className="max-w-7xl mx-auto px-4 py-10 text-xs text-slate-500">
          <p>Built for NASA Space Apps Challenge — Kigali focus. Satellite indicators are <b>advisory only</b>; always confirm with field checks and official emergency channels.</p>
          <p className="mt-1">Data: NASA POWER • NASA FIRMS (VIIRS/MODIS) • NASA EONET • NASA GPM IMERG • NASA SMAP • USGS Landsat / Copernicus Sentinel-2 via HLS • Open-Meteo • SRTM. See /docs for lineage.</p>
        </footer>
      </body>
    </html>
  );
}

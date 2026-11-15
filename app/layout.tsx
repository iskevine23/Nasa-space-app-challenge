import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Ubuhinzi Sentinel — Your Farm Helper",
  description: "Simple farm advice from NASA satellites. Made for Rwanda."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="rw">
      <body>
        <header className="sticky top-0 z-30 backdrop-blur bg-white/90 border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#166534] text-white grid place-items-center text-lg">🌿</div>
              <div>
                <div className="font-black leading-none text-[#166534]">Ubuhinzi Sentinel</div>
                <div className="text-xs text-stone-500">Umujyanama w'umurima • Farm helper • Rwanda</div>
              </div>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2 text-sm">
              <Link href="/" className="btn-ghost !px-3 !py-2">🏠 Home</Link>
              <Link href="/fields" className="btn-ghost !px-3 !py-2">🌾 My Fields</Link>
              <Link href="/map" className="btn-ghost !px-3 !py-2">🗺️ Map</Link>
              <Link href="/docs" className="hidden md:inline-flex btn-ghost !px-3 !py-2 text-stone-500">Docs</Link>
              <Link href="/map" className="hidden sm:inline-flex btn ml-1">See my farm →</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <footer className="max-w-7xl mx-auto px-4 py-10">
          <div className="card bg-stone-900 text-stone-300 border-stone-800">
            <div className="flex flex-wrap gap-3 justify-between text-xs">
              <div>
                <div className="font-bold text-white">🌿 Ubuhinzi Sentinel — NASA Space Apps Kigali</div>
                <div className="mt-1 text-stone-400">This is <b className="text-amber-300">advice only</b> — always check your field and listen to official warnings (Rwanda Meteo, MINEMA).</div>
              </div>
              <div className="text-stone-400">🛰️ NASA POWER • FIRMS • EONET • GIBS • HLS<br/>Made with ❤️ for Rwandan farmers</div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

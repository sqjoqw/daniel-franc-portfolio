# Daniel Franc — portfolio

Rekreační portfólio ve stylu „desktopového operačního systému", postavené na
**Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Motion + lucide-react**.
Obsah je reálný (převzat z původního webu Daniela Francse) a žije odděleně od prezentace.

## Spuštění

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # produkční build
npm run start   # produkční server
```

> Pozn.: Na tomto stroji není Node.js nainstalovaný globálně — přenosná verze je
> ve workspace ve složce `../.tools/node`. Pro ruční spuštění stačí Node 20+.

## Kde je co

| Co | Kde |
| --- | --- |
| **Veškerý obsah** (jméno, odkazy, ikony, pilíře, praxe, o mě) | [src/data/site.ts](src/data/site.ts) |
| **Manifest médií portfolia** (generovaný) | [src/data/media.ts](src/data/media.ts) |
| Globální styly, klíčové animace, kurzor, scrollbar, tapeta | [src/app/globals.css](src/app/globals.css) |
| Plocha: tapeta, lišta, ikony, widgety, hero | [src/components/Desktop.tsx](src/components/Desktop.tsx) |
| Widgety: hodiny, kalendář, hudba, počasí, dock | [src/components/widgets.tsx](src/components/widgets.tsx) |
| Ikony plochy (složka, „Tento počítač") | [src/components/folder-icon.tsx](src/components/folder-icon.tsx) |
| Sekce: dovednosti, pilíře, praxe, o mě, patička | [src/components/sections.tsx](src/components/sections.tsx) |
| Okna: složky, portfolio, rezervace, nastavení, terminál | [src/components/windows.tsx](src/components/windows.tsx) |
| Tažení + magnetické přisouvání ikon | [src/lib/use-draggable.ts](src/lib/use-draggable.ts) |

## Média portfolia

Galerie čte manifest `src/data/media.ts` (142 fotek + 16 videí, ~1 GB) —
generuje ho skript:

```bash
node scripts/build-media-manifest.cjs
```

Skript zkopíruje `C:/Users/danik/Documents/portfolio/{grafika,photos,videos}` do
`public/media/` (slugované názvy bez diakritiky), načte vnitřní rozměry obrázků
(pro správné poměry stran) a přegeneruje manifest. Je idempotentní.

Wallpaper webu je `public/photobg.jpeg` (kopie `photobg.jpeg` z Downloads);
přes fotku je vrstvený bílý závoj + jemný animovaný CSS noise gradient
(třídy `.wallpaper-veil`, `.wallpaper-noise` v globals.css).

## Hudba

Přehrávač je plně funkční — přehrává generovaný demo loop z `public/audio/demo-loop.wav`
(soubor vytvoří skript `node scripts/generate-demo-audio.cjs`). Vlastní skladbu
přidáš takto:

1. Vlož soubor do `public/audio/` (např. `track.m4a`).
2. V [src/data/site.ts](src/data/site.ts) uprav `music.src`, `music.title` a `music.artist`.

## Počasí

Widget vytahuje skutečnou předpověď pro Prahu z open-meteo.com (bez API klíče).
Když API není dostupné, zobrazí náhradní data ze `weather.fallback`.

## Interakce

- Tažitelné ikony i widgety na ploše (pozice se ukládá do `localStorage`) s
  **magnetickým přisouváním** — pustíš-li ikonu blízko původní pozice, plynule se
  vrátí zpět (CSS transition, ~380 ms).
- Složky na ploše (5 dovedností): kliknutí otevře stylizované okno a automaticky
  doscrolluje na danou dovednost v sekci Dovednosti + blikne zvýrazněním.
- **Creative Portfolio** (červená složka) i skrytý vstup přes tlačítko v sekci
  O mě otevírají galerii s kolekcemi Grafika / Fotky / Videa, lightboxem
  (šipky ←/→, ESC) a uploadem vlastních fotek a videí.
- **Tento počítač** — ikona počítače otevírá okno Nastavení.
- Kalendář → okno rezervace schůzky (datum, čas, kontakt).
- Hudba: klik kamkoliv na přehrávač spustí/pozastaví hudbu, při přehrávání běží
  equalizer.
- Terminál (`visitor@danielfranc`) — `help`, `ls`, `cat contact.txt`, `whoami`, `clear`, `exit`.
- Plynulé scrollování, scroll-reveal animace, `prefers-reduced-motion` podpora,
  vlastní kurzor jen na zařízeních s myší, přístupnost (aria-labely, klávesnice).
- Sekce Právní info byla na požádání odstraněna (zůstal jen copyright v patičce).

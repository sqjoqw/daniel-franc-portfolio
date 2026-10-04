import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bricolage-sans",
  display: "swap",
});

const displaySerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-clepto-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daniel Franc | Videomaker & IT student",
  description:
    "Produkuji a stříhám videa, vedu studentský tým a propojuji vizuální tvorbu s logickým IT myšlením.",
  openGraph: {
    title: "Daniel Franc | Videomaker & IT student",
    description:
      "Produkuji a stříhám videa, vedu studentský tým a propojuji vizuální tvorbu s logickým IT myšlením.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className={`${bricolage.variable} ${displaySerif.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}

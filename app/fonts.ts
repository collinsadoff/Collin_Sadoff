/**
 * Fonts, loaded and self-hosted at build time by next/font so there is no
 * external request and no layout shift.
 *
 *   Archivo       - condensed-feeling grotesk used for every heading.
 *   Inter         - body copy.
 *   JetBrains Mono- small metadata labels, timecode, section numbers.
 */
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";

export const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  weight: ["500", "600", "700", "800", "900"],
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const fontVariables = `${archivo.variable} ${inter.variable} ${jetbrains.variable}`;

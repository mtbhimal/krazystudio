import type { Metadata } from "next";
import { Bebas_Neue, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "Krazy Music Studio | Recording, Mixing & Music Production",
  description:
    "A professional recording studio for artists who want their sound to feel like an experience. Book a session at Krazy Music Studio.",
  openGraph: {
    title: "Krazy Music Studio",
    description: "Where music isn't just heard—it's felt.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-ink text-paper font-body antialiased selection:bg-violet/40 min-h-screen flex flex-col">
        {/* Zero top padding: allows background gradient to extend seamlessly under the navbar */}
        <main className="flex-1 bg-ink">
          {children}
        </main>
      </body>
    </html>
  );
}

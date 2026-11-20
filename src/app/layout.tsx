import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SalonBook — A slower kind of beautiful",
    template: "%s · SalonBook",
  },
  description:
    "SalonBook is a downtown atelier for hair, skin and nails. Browse our rituals, choose your artist, and request an appointment online.",
  keywords: [
    "salon",
    "hair salon",
    "appointment booking",
    "balayage",
    "facial",
    "manicure",
    "bridal beauty",
  ],
  openGraph: {
    title: "SalonBook — A slower kind of beautiful",
    description:
      "A downtown atelier for hair, skin and nails, and a calmer way to book your seat.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-ivory text-espresso">
        <div
          aria-hidden
          className="grain pointer-events-none fixed inset-0 z-100 opacity-[0.035] mix-blend-multiply"
        />
         <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
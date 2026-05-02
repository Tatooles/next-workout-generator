import "./globals.css";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import type { Metadata } from "next";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Workout Generator",
  description: "AI-powered personalized workouts and weekly training programs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}

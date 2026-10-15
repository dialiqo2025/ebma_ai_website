import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "ebma AI — Voice & language intelligence",
  description:
    "Build intelligent voice and language experiences with ebma AI. Speech to text, text to speech, and conversational AI.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=4", type: "image/x-icon", sizes: "64x64" },
      { url: "/favicon-transparent.png?v=4", type: "image/png", sizes: "256x256" },
    ],
    apple: "/favicon-transparent.png?v=4",
    shortcut: "/favicon.ico?v=4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

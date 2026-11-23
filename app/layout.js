import "./globals.css";
import { Cinzel, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-editorial",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-tc",
});

export const metadata = {
  title: "Talha Bhatti — Video Editor",
  description:
    "Portfolio of Talha Bhatti, a video editor and colorist. Commercial films, music videos, documentaries, DaVinci Resolve grading, and social cutdowns.",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${jakarta.variable} ${mono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}

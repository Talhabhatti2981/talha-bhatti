import "./globals.css";
export const metadata = {
  title: "Talha Bhatti | Video Editor and Colorist",
  description:
    "Explore Talha Bhatti’s video editing portfolio. Commercial video editing, music videos, documentary editing, DaVinci Resolve color grading and social media videos.",
  keywords: ["Talha Bhatti", "video editor", "video editing portfolio", "color grading", "commercial video editing", "music video editing", "documentary editing", "social media video editing"],
  openGraph: { title: "Talha Bhatti | Video Editor and Colorist", description: "Picture editing, color grading and sound for films, brands and social content.", type: "website", locale: "en_US" },
  twitter: { card: "summary", title: "Talha Bhatti | Video Editor and Colorist", description: "Explore films, editing projects and color grading by Talha Bhatti." },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}

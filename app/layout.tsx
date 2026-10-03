import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = { title: "Contact – Formgong Next.js starter" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Optional: counts form views without cookies and sets the Turnstile language. */}
        <Script src="https://formgong.com/fg.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

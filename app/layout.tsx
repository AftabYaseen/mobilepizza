import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mobile Pizza | Fresh Wood-Fired Pizza Anywhere In South Wales",
  description: "Mobile wood-fired pizza for weddings, events, festivals and parties across South Wales. Based in Bridgend. No spam — just great pizza.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

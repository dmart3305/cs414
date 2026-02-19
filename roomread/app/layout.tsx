import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const _geistSans = Geist({
  subsets: ["latin"],
});

const _geistMono = Geist_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RoomRead - Learn Cultural Norms Before You Travel",
  description:
    "An educational travel tool that teaches you about cultural norms, social etiquette, and local customs in countries around the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

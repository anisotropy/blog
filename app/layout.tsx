import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const mainKrFont = Noto_Serif_KR({
  variable: "--font-main-kr",
  weight: ["400", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "짧은 글",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${mainKrFont.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}

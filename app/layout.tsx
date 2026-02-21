import type { Metadata } from "next";
import { Noto_Serif_KR, Newsreader } from "next/font/google";
import "./globals.css";

const mainKrFont = Noto_Serif_KR({
  variable: "--font-main-kr",
  weight: ["400", "700", "800"],
  subsets: ["latin"],
});

const mainEnFont = Newsreader({
  variable: "--font-main-en",
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
    <html
      lang="ko"
      className={`${mainKrFont.variable} ${mainEnFont.variable} antialiased leading-[1.7em] max-w-prose mx-auto p-10 text-justify`}
    >
      <body>{children}</body>
    </html>
  );
}

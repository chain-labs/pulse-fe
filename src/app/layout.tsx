import type { Metadata } from "next";
import localFont from "next/font/local";

import AppProvider from "@/stores/app-context";

import { getUserCards } from "../../api/app.api";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Chainlabs Frontend Nextjs Template",
  description: "Generated by chainlabs team",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userCards = await getUserCards();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider userCards={userCards}>{children}</AppProvider>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/context/global";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIPAKDe",
  description: "",
  icons: "/sipakde.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GlobalProvider>
        <body className={inter.className}>{children}</body>
      </GlobalProvider>
    </html>
  );
}

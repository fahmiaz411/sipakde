import { AuthRole } from "@/middleware/auth";
import type { Metadata } from "next";

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
    <AuthRole role="user">
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthRole>
  );
}

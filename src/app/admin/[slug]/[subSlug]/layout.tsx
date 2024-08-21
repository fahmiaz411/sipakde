import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sub",
  description: "Admin Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

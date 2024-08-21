import { AuthRole } from "@/middleware/auth";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthRole role="admin">
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthRole>
  );
}

import "@packages/ui-w/styles/globals.css";
import type { Metadata } from "next";
import type { JSX } from "react";

export const metadata: Metadata = {
  title: "Churchbase",
  description:
    "Churchbase gives church teams a shared foundation to organize their work, care for their members, coordinate ministries, and serve their community.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

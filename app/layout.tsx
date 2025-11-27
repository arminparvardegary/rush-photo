import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rush Photo | Professional Product Photography",
  description: "Ship your product, choose a style, and get stunning photos that convert browsers into buyers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}


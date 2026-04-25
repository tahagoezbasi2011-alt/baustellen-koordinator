import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Baustellen-Koordinator",
  description: "Koordiniere deine Baustelle einfach und digital",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="h-full">
      <body className={`${geist.className} min-h-full bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}

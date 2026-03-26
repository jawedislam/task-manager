import type { Metadata } from "next";
import Nav from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notes Manager",
  description: "Track notes and follow-ups organized by project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Nav />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}

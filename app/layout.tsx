import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastContainer from "@/app/components/ToastContainer";
import Sidebar from "@/app/components/Sidebar";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neon DB Todo POC",
  description: "Todo POC with Neon + Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [todosContent, dashboardContent] = await Promise.all([
    prisma.pageContent.findUnique({ where: { page: "todos" }, select: { heading: true } }),
    prisma.pageContent.findUnique({ where: { page: "dashboard" }, select: { heading: true } }),
  ]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex flex-1">
          <div className="flex-1 min-w-0">{children}</div>
          <Sidebar
            todoHeading={todosContent?.heading ?? "My Todos"}
            dashboardHeading={dashboardContent?.heading ?? "Dashboard"}
          />
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}

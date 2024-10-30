import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WalletProviderWrapper } from "@/components/WalletProviderWrapper";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Token Manager",
  description: "Superteam FTW",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <WalletProviderWrapper>
          {children}
          <Toaster />
        </WalletProviderWrapper>
      </body>
    </html>
  );
}

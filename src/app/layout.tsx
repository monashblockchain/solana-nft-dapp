import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WalletProviderWrapper } from "@/components/WalletProviderWrapper";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana NFT dApp",
  description:
    "A Solana NFT dApp for minting and managing tokens and collections",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${inter.className} bg-gradient-to-b from-primary/10 to-secondary/10 min-h-full bg-fixed bg-cover`}
        suppressHydrationWarning={true}
      >
        <WalletProviderWrapper>
          {children}
          <Toaster />
        </WalletProviderWrapper>
      </body>
    </html>
  );
}

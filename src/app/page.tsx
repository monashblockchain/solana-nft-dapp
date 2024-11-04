"use client";

import NFTMinter from "@/components/NFTMinter";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">NFT Minter</h1>
      <div className="absolute top-3 right-3">
        <WalletMultiButton />
      </div>
      <NFTMinter />
    </main>
  );
}

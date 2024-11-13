"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchTokenMetadataAssets } from "@/lib/fetchTokenMetadataAssets";
import { fetchCoreAssets } from "@/lib/fetchCoreAssets";
import NFTGallery from "@/components/NFTGallery";
import { NFT } from "@/types/NFT";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";

export default function Home() {
  const { publicKey, wallet } = useWallet();
  const [tokenMetadataAssets, setTokenMetadataAssets] = useState<NFT[]>([]);
  const [coreAssets, setCoreAssets] = useState<NFT[]>([]);

  useEffect(() => {
    if (wallet && publicKey) {
      // Fetch Token Metadata NFTs
      fetchTokenMetadataAssets(publicKey, wallet.adapter).then(
        setTokenMetadataAssets
      );
      // Fetch Core Assets
      fetchCoreAssets(publicKey, wallet.adapter).then(setCoreAssets);
    }
  }, [wallet, publicKey]);

  return (
    <main>
      {/* Header */}
      <header className="flex items-center justify-between w-full">
        <div className="w-full flex justify-between px-36 py-2 mx-auto bg-gradient-to-br from-primary/20 to-secondary/50">
          <div className="flex items-center space-x-3">
            <Image src="/logo.png" alt="Mintopia Logo" width={40} height={40} />
            <h1 className="text-xl font-semibold">Mintopia</h1>
          </div>
          <div>
            <WalletMultiButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto py-3">
        {/* NFT Gallery */}
        <NFTGallery
          tokenMetadataNFTs={tokenMetadataAssets}
          coreAssets={coreAssets}
          isWalletConnected={!!wallet && !!publicKey}
        />
      </div>
    </main>
  );
}

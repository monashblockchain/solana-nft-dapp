"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchTokenMetadataAssets } from "@/lib/fetchTokenMetadataAssets";
import { fetchCoreAssets } from "@/lib/fetchCoreAssets";
import NFTGallery from "@/components/NFTGallery";
import { NFT } from "@/types/NFT";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

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
    <main className="container mx-auto p-4">
      <div className="absolute top-3 right-3">
        <WalletMultiButton />
      </div>

      <h1 className="text-2xl font-semibold text-center my-4">NFT Gallery</h1>
      <NFTGallery
        tokenMetadataNFTs={tokenMetadataAssets}
        coreAssets={coreAssets}
      />
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import NFTMinter from "@/components/NFTMinter/NFTMinter";
import NFTGallery from "@/components/NFTGallery";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchSolanaNFTs } from "@/lib/fetchSolanaNFTs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Home() {
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    async function loadNFTs() {
      if (publicKey) {
        const walletAddress = publicKey.toString();
        const nftsData = await fetchSolanaNFTs(walletAddress);
        setNfts(nftsData);
      }
    }
    loadNFTs();
  }, [publicKey]);

  return (
    <main className="container mx-auto p-4 bg-transparent">
      <div className="absolute top-3 right-3">
        <WalletMultiButton />
      </div>

      <div className="flex justify-between items-center mt-4">
        <h1 className="text-2xl font-semibold text-bg-foreground">
          NFT Gallery
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="shadow-md transition-all duration-300 hover:shadow-lg">
              Mint New NFT
            </Button>
          </DialogTrigger>
          <DialogContent className="py-0.5 px-4">
            <DialogHeader hidden={true}></DialogHeader>
            <NFTMinter />
          </DialogContent>
        </Dialog>
      </div>

      <NFTGallery nfts={nfts} />
    </main>
  );
}

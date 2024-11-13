"use client";

import { NFT } from "@/types/NFT";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import BurnButton from "./BurnButton";
import TransferButton from "./TransferButton";
import EditButton from "./EditButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

interface NFTDetailsTabProps {
  nft: NFT;
}

export default function NFTDetailsTab({ nft }: NFTDetailsTabProps) {
  const { wallet } = useWallet();
  const [copied, setCopied] = useState(false);

  if (!wallet) {
    return null;
  }

  const umi = createUmi("https://api.devnet.solana.com")
    .use(mplTokenMetadata())
    .use(mplCore())
    .use(walletAdapterIdentity(wallet.adapter));

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(nft.mintAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="space-y-3">
        <div className="aspect-square w-full overflow-hidden rounded-lg shadow-lg">
          <img
            src={nft.metadata?.image || "/placeholder.jpg"}
            alt={nft.metadata?.name || "NFT"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Description</h4>
          <p className="text-sm text-muted-foreground">
            {nft.metadata?.description || "No description"}
          </p>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Mint Address</h4>
          <div className="flex items-center space-x-2">
            <a
              href={`https://solscan.io/token/${nft.mintAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex-1 truncate"
            >
              {nft.mintAddress} <ExternalLink className="inline h-3 w-3" />
            </a>
            <button
              onClick={handleCopyAddress}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-grow" style={{ height: "70%" }}>
          <div className="flex space-x-1 items-center text-sm font-semibold mb-2">
            <p>Attributes</p>
            <p className="bg-muted px-1 py-0.5 rounded-sm">
              {nft.metadata?.attributes?.length || 0}
            </p>
          </div>
          {nft.metadata?.attributes && nft.metadata.attributes.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {nft.metadata.attributes.map((attr: any, index: any) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-primary/10 to-secondary/10 p-3 rounded-lg shadow transition-shadow duration-300 hover:shadow-md"
                >
                  <p className="text-xs font-semibold text-primary mb-1">
                    {attr.trait_type}
                  </p>
                  <p className="text-sm font-medium">{attr.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No attributes found</p>
          )}
        </ScrollArea>
        <div
          className="flex items-center justify-center space-x-4"
          style={{ height: "30%" }}
        >
          <BurnButton nft={nft} umi={umi} owner={wallet?.adapter} />
          <TransferButton nft={nft} umi={umi} owner={wallet?.adapter} />
          <EditButton nft={nft} umi={umi} />
        </div>
      </div>
    </div>
  );
}

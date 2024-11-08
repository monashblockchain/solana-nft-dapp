"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import NFTCard from "./NFTCard/NFTCard";
import { NFT } from "@/types/NFT";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface NFTGalleryProps {
  tokenMetadataNFTs: NFT[];
  coreAssets: NFT[];
}

export default function NFTGallery({
  tokenMetadataNFTs,
  coreAssets,
}: NFTGalleryProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (tokenMetadataNFTs.length > 0 || coreAssets.length > 0) {
      setIsLoading(false);
    }
  }, [tokenMetadataNFTs, coreAssets]);

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="overflow-hidden">
              <Skeleton className="w-full pt-[110%]" />
              <div className="p-4 h-[90px]">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="p-2">
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      <Accordion type="multiple">
        {/* Token Metadata NFTs Section */}
        <AccordionItem value="token-metadata">
          <AccordionTrigger className="text-lg font-semibold">
            Token Metadata NFTs ({tokenMetadataNFTs.length})
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
              {tokenMetadataNFTs.map((nft) => (
                <NFTCard key={nft.mintAddress} nft={nft} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Core Assets Section */}
        <AccordionItem value="core-assets">
          <AccordionTrigger className="text-lg font-semibold">
            Core Assets ({coreAssets.length})
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
              {coreAssets.map((nft) => (
                <NFTCard key={nft.mintAddress} nft={nft} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

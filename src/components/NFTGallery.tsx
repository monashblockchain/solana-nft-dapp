"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import NFTCard from "./NFTCard";
import { NFT } from "@/types/NFT";

interface NFTGalleryProps {
  nfts: NFT[];
}

export default function NFTGallery({ nfts }: NFTGalleryProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (nfts.length > 0) {
      setIsLoading(false);
    }
  }, [nfts]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8 p-4">
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
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8 p-4">
      {nfts.map((nft) => (
        <NFTCard key={nft.mintAddress} nft={nft} />
      ))}
    </div>
  );
}

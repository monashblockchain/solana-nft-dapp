"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import NFTCard from "./NFTCard/NFTCard";
import { NFT } from "@/types/NFT";
import NFTMinter from "./NFTMinter/NFTMinter";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Grid, Columns, List } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NFTGalleryProps {
  tokenMetadataNFTs: NFT[];
  coreAssets: NFT[];
}

type ViewMode = "large" | "small" | "list";

export default function NFTGallery({
  tokenMetadataNFTs,
  coreAssets,
}: NFTGalleryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("large");

  useEffect(() => {
    if (tokenMetadataNFTs.length > 0 || coreAssets.length > 0) {
      setIsLoading(false);
    }
  }, [tokenMetadataNFTs, coreAssets]);

  const getGridClasses = () => {
    switch (viewMode) {
      case "large":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4";
      case "small":
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3";
      case "list":
        return "grid-cols-1 gap-2";
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className={`grid ${getGridClasses()}`}>
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
    <div className="p-4">
      <div className="flex justify-between w-full">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("large")}
            className={
              viewMode === "large" ? "bg-primary text-primary-foreground" : ""
            }
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("small")}
            className={
              viewMode === "small" ? "bg-primary text-primary-foreground" : ""
            }
          >
            <Columns className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={
              viewMode === "list" ? "bg-primary text-primary-foreground" : ""
            }
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Dialog Trigger for NFT Minter */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <p>Mint New NFT</p>
            </Button>
          </DialogTrigger>
          <DialogContent className="px-2 pt-0 pb-0.5 bg-secondary/50 backdrop-blur-md">
            <DialogHeader>
              <DialogTitle hidden={true}>Mint a New NFT</DialogTitle>
            </DialogHeader>
            <NFTMinter />
          </DialogContent>
        </Dialog>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["token-metadata", "core-assets"]}
      >
        {/* Token Metadata NFTs Section */}
        <AccordionItem value="token-metadata">
          <AccordionTrigger className="text-lg font-semibold">
            Token Metadata NFTs ({tokenMetadataNFTs.length})
          </AccordionTrigger>
          <AccordionContent>
            <div className={`grid ${getGridClasses()} mt-4`}>
              {tokenMetadataNFTs.map((nft) => (
                <NFTCard key={nft.mintAddress} nft={nft} viewMode={viewMode} />
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
            <div className={`grid ${getGridClasses()} mt-4`}>
              {coreAssets.map((nft) => (
                <NFTCard key={nft.mintAddress} nft={nft} viewMode={viewMode} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

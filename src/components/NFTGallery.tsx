"use client";

import { useEffect, useState } from "react";
import NFTCard from "./NFTCard/NFTCard";
import { NFT } from "@/types/NFT";
import NFTMinter from "./NFTMinter/NFTMinter";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ViewModeButtons from "./ViewModeButtons";
import NFTGallerySkeleton from "./NFTGallerySkeleton";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTokenMetadataNFTs, setFilteredTokenMetadataNFTs] =
    useState(tokenMetadataNFTs);
  const [filteredCoreAssets, setFilteredCoreAssets] = useState(coreAssets);

  useEffect(() => {
    if (tokenMetadataNFTs.length > 0 || coreAssets.length > 0) {
      setIsLoading(false);
    }
  }, [tokenMetadataNFTs, coreAssets]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    setFilteredTokenMetadataNFTs(
      tokenMetadataNFTs.filter((nft) =>
        nft.name.toLowerCase().includes(lowerCaseQuery)
      )
    );
    setFilteredCoreAssets(
      coreAssets.filter((nft) =>
        nft.name.toLowerCase().includes(lowerCaseQuery)
      )
    );
  }, [searchQuery, tokenMetadataNFTs, coreAssets]);

  if (isLoading) {
    return <NFTGallerySkeleton viewMode={viewMode} />;
  }

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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center w-full">
        {/* View Mode Buttons */}
        <ViewModeButtons viewMode={viewMode} setViewMode={setViewMode} />

        {/* Search bar */}
        <div className="flex items-center w-1/2">
          <Input
            placeholder="Search NFTs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-r-none"
          />
          <Button
            variant="outline"
            size="icon"
            className="rounded-l-none border-l-0 bg-transparent"
          >
            <Search className="h-5 w-5" />
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

      {/* Accordion for Token Metadata NFTs and Core Assets */}
      <Accordion
        type="multiple"
        defaultValue={["token-metadata", "core-assets"]}
      >
        <AccordionItem value="token-metadata">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex space-x-1.5 items-center">
              <p>Token Metadata NFTs</p>
              <p className="bg-muted px-1 rounded-sm">
                {filteredTokenMetadataNFTs.length}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className={`grid ${getGridClasses()}`}>
              {filteredTokenMetadataNFTs.map((nft) => (
                <NFTCard key={nft.mintAddress} nft={nft} viewMode={viewMode} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="core-assets">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex space-x-1.5 items-center">
              <p>Core Assets</p>
              <p className="bg-muted px-1 rounded-sm">
                {filteredCoreAssets.length}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className={`grid ${getGridClasses()}`}>
              {filteredCoreAssets.map((nft) => (
                <NFTCard key={nft.mintAddress} nft={nft} viewMode={viewMode} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

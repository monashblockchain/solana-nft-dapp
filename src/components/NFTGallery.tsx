"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface NFT {
  mintAddress: string;
  metadata?: {
    image?: string;
    name?: string;
    description?: string;
  };
}

interface NFTGalleryProps {
  nfts: NFT[];
}

export default function NFTGallery({ nfts }: NFTGalleryProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
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
          <Card key={index} className="overflow-hidden">
            <Skeleton className="w-full pt-[110%]" />
            <CardContent className="p-4 h-[90px]">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
            <CardFooter className="p-2">
              <Skeleton className="h-4 w-1/2" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8 p-4">
      {nfts.map((nft) => (
        <motion.div
          key={nft.mintAddress}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className={`group overflow-hidden transition-all duration-300 bg-card border-none hover:shadow-lg ${
              hoveredCard === nft.mintAddress ? "shadow-2xl" : ""
            }`}
            onMouseEnter={() => setHoveredCard(nft.mintAddress)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative w-full pt-[110%] overflow-hidden">
              {" "}
              {/* 4:5 aspect ratio */}
              <img
                src={nft.metadata?.image || "/placeholder.jpg"}
                alt={nft.metadata?.name || "NFT"}
                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <CardContent className="p-4 h-[90px]">
              <h3 className="text-sm font-bold mb-1 truncate text-card-foreground">
                {nft.metadata?.name || "Unnamed NFT"}
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {nft.metadata?.description || "No description"}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      {nft.metadata?.description || "No description"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
            <CardFooter className="bg-muted/50 p-2 flex justify-between items-center">
              <p className="text-xs text-muted-foreground font-mono">
                ID: {nft.mintAddress.slice(0, 6)}...
              </p>
              <div className="h-4 w-4 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

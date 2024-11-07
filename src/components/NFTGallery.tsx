"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 p-6">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full sm:h-60 md:h-72" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 p-6">
      {nfts.map((nft) => (
        <motion.div
          key={nft.mintAddress}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className={`group overflow-hidden transition-all duration-300 bg-card hover:shadow-lg ${
              hoveredCard === nft.mintAddress ? "ring-2 ring-primary" : ""
            }`}
            onMouseEnter={() => setHoveredCard(nft.mintAddress)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ width: "100%", height: "100%" }}
          >
            <div className="relative w-full h-48 sm:h-60 md:h-72 overflow-hidden">
              <img
                src={nft.metadata?.image || "/placeholder.jpg"}
                alt={nft.metadata?.name || "NFT"}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <CardContent className="p-4 relative">
              <h3 className="text-lg font-bold mb-2 truncate text-card-foreground">
                {nft.metadata?.name || "Unnamed NFT"}
              </h3>
              {nft.metadata?.description ? (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {nft.metadata.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  No description
                </p>
              )}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 transform rotate-45 translate-x-8 -translate-y-8" />
            </CardContent>
            <CardFooter className="bg-muted/50 p-2 flex justify-between items-center">
              <p className="text-xs text-muted-foreground font-mono">
                ID: {nft.mintAddress.slice(0, 8)}...
              </p>
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

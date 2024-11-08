"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { NFT } from "@/types/NFT";
import NFTDialog from "./NFTDialog";

interface NFTCardProps {
  nft: NFT;
  onBurn: (mintAddress: string) => void;
}

export default function NFTCard({ nft, onBurn }: NFTCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Card
            className={`group overflow-hidden transition-all duration-300 bg-card border-none hover:shadow-lg cursor-pointer ${
              hovered ? "shadow-2xl" : ""
            }`}
          >
            <div className="relative w-full pt-[110%] overflow-hidden">
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
      </DialogTrigger>
      <NFTDialog nft={nft} onBurn={onBurn} />
    </Dialog>
  );
}

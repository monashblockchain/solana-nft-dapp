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
  viewMode: "large" | "small" | "list";
}

export default function NFTCard({ nft, viewMode }: NFTCardProps) {
  const [hovered, setHovered] = useState(false);

  const getCardClasses = () => {
    switch (viewMode) {
      case "large":
        return "h-full";
      case "small":
        return "h-full";
      case "list":
        return "flex flex-row items-center p-2";
    }
  };

  const getImageClasses = () => {
    switch (viewMode) {
      case "large":
        return "w-full pt-[110%]";
      case "small":
        return "w-full pt-[100%]";
      case "list":
        return "w-16 h-16 flex-shrink-0";
    }
  };

  const getContentClasses = () => {
    switch (viewMode) {
      case "large":
        return "h-[90px]";
      case "small":
        return "h-[70px]";
      case "list":
        return "flex-grow ml-4";
    }
  };

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
            className={`group overflow-hidden transition-all duration-300 bg-card/70 border-none hover:shadow-lg cursor-pointer ${
              hovered ? "shadow-2xl" : ""
            } ${getCardClasses()}`}
          >
            <div className={`relative overflow-hidden ${getImageClasses()}`}>
              <img
                src={nft.metadata?.image || "/placeholder.jpg"}
                alt={nft.metadata?.name || "NFT"}
                className={`${
                  viewMode === "list"
                    ? "w-full h-full"
                    : "absolute top-0 left-0 w-full h-full"
                } object-cover transition-transform duration-300 group-hover:scale-105 rounded-tl-md rounded-tr-md`}
              />
            </div>
            <CardContent
              className={`${
                viewMode == "list" ? "p-0.5" : "p-4"
              } ${getContentClasses()}`}
            >
              <div className={viewMode === "list" ? "flex flex-col" : ""}>
                <h3 className="text-sm font-bold mb-1 truncate text-card-foreground">
                  {nft.name || "Unnamed NFT"}
                </h3>
                {viewMode === "list" && (
                  <p className="text-xs text-muted-foreground mb-1">
                    Symbol: {nft.symbol || "N/A"}
                  </p>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p
                        className={`text-xs text-muted-foreground ${
                          viewMode === "list" ? "" : "line-clamp-2"
                        }`}
                      >
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
              </div>
            </CardContent>
            {viewMode !== "list" && (
              <CardFooter className="bg-muted/50 p-2 flex justify-between items-center">
                <p className="text-xs text-muted-foreground font-mono">
                  ID: {nft.mintAddress.slice(0, 6)}...
                </p>
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </DialogTrigger>
      <NFTDialog nft={nft} />
    </Dialog>
  );
}

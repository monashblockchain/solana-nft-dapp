"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { NFT } from "@/types/NFT";
import { Copy, Check, ExternalLink } from "lucide-react";

interface NFTCardProps {
  nft: NFT;
  onBurn: (mintAddress: string) => void;
}

export default function NFTCard({ nft, onBurn }: NFTCardProps) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleBurn = () => {
    if (
      window.confirm(
        "Are you sure you want to burn this NFT? This action cannot be undone."
      )
    ) {
      onBurn(nft.mintAddress);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(nft.mintAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{nft.metadata?.name || "Unnamed NFT"}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details" className="flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details & Attributes</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="flex-grow overflow-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square w-full overflow-hidden rounded-lg">
                  <img
                    src={nft.metadata?.image || "/placeholder.jpg"}
                    alt={nft.metadata?.name || "NFT"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {nft.metadata?.description || "No description"}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-muted-foreground font-mono">
                    Mint Address:
                  </p>
                  <a
                    href={`https://explorer.solana.com/address/${nft.mintAddress}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    {nft.mintAddress.slice(0, 6)}...{nft.mintAddress.slice(-4)}{" "}
                    <ExternalLink className="inline h-3 w-3" />
                  </a>
                  <button
                    onClick={handleCopyAddress}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Attributes</h4>
                {nft.metadata?.attributes ? (
                  <div className="grid grid-cols-2 gap-2">
                    {nft.metadata.attributes.map((attr, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-primary/10 to-secondary/10 p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
                      >
                        <p className="text-xs font-semibold text-primary mb-1">
                          {attr.trait_type}
                        </p>
                        <p className="text-sm font-medium">{attr.value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No attributes found
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="metadata" className="flex-grow">
            <ScrollArea className="h-full">
              <pre className="bg-muted p-4 rounded-md text-xs whitespace-pre-wrap">
                {JSON.stringify(nft.metadata, null, 2)}
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <Button
          variant="destructive"
          className="w-full mt-4"
          onClick={handleBurn}
        >
          Burn NFT
        </Button>
      </DialogContent>
    </Dialog>
  );
}

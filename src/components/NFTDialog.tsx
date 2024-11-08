"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Check, ExternalLink } from "lucide-react";
import { NFT } from "@/types/NFT";
import BurnButton from "./BurnButton";

interface NFTDialogProps {
  nft: NFT;
  onBurn: (mintAddress: string) => void;
}

export default function NFTDialog({ nft, onBurn }: NFTDialogProps) {
  const [copied, setCopied] = useState(false);
  const [selectedTab, setSelectedTab] = useState("details");

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(nft.mintAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format metadata as color-coded JSON string
  const formattedMetadata = JSON.stringify(nft.metadata, null, 2)
    .replace(/"([^"]+)":/g, `"<span class="text-primary">$1</span>":`) // Color keys
    .replace(/: "(.*?)"/g, `: "<span class="text-muted-foreground">$1</span>"`) // Color string values
    .replace(/: (\d+)/g, `: <span class="text-muted-foreground">$1</span>`); // Color numeric values

  return (
    <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold flex space-x-2 items-center">
          <p className="text-primary">{nft.metadata?.name || "Unnamed NFT"}</p>
          <p className="text-lg text-gray-500 font-semibold">-</p>
          <p className="text-lg text-gray-500 font-semibold">
            {nft.metadata?.symbol || "N/A"}
          </p>
        </DialogTitle>
      </DialogHeader>
      <Tabs
        defaultValue="details"
        className="flex-grow flex flex-col"
        onValueChange={(value) => setSelectedTab(value)}
      >
        <TabsList className="relative w-full grid grid-cols-2 gap-3 bg-transparent">
          <TabsTrigger
            value="details"
            className="relative px-4 py-2 text-sm font-semibold text-gray-700 transition-colors duration-300 focus:outline-none"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="metadata"
            className="relative px-4 py-2 text-sm font-semibold text-gray-700 transition-colors duration-300 focus:outline-none"
          >
            Metadata
          </TabsTrigger>
          <span
            className="absolute bottom-0 left-0 h-[2px] bg-primary transition-transform duration-300"
            style={{
              width: "49%",
              transform: `translateX(${
                selectedTab === "metadata" ? "100%" : "0%"
              })`,
            }}
          />
        </TabsList>
        <TabsContent value="details" className="flex-grow overflow-auto">
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="space-y-3">
              <div className="aspect-square w-full overflow-hidden rounded-lg shadow-lg">
                <img
                  src={nft.metadata?.image || "/placeholder.jpg"}
                  alt={nft.metadata?.name || "NFT"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="text-sm font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {nft.metadata?.description || "No description"}
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="text-sm font-semibold mb-2">Mint Address</h4>
                <div className="flex items-center space-x-2">
                  <a
                    href={`https://explorer.solana.com/address/${nft.mintAddress}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex-1 truncate"
                  >
                    {nft.mintAddress}{" "}
                    <ExternalLink className="inline h-3 w-3" />
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
              <ScrollArea className="flex-grow" style={{ height: "80%" }}>
                <div className="flex space-x-1 items-center text-sm font-semibold mb-2">
                  <p>Attributes</p>
                  <p className="bg-muted px-1 py-0.5 rounded-sm">
                    {nft.metadata?.attributes?.length || 0}
                  </p>
                </div>
                {nft.metadata?.attributes &&
                nft.metadata.attributes.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {nft.metadata.attributes.map((attr, index) => (
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
                  <p className="text-sm text-muted-foreground">
                    No attributes found
                  </p>
                )}
              </ScrollArea>
              <div
                className="flex items-center justify-center"
                style={{ height: "20%" }}
              >
                <BurnButton onBurn={() => onBurn(nft.mintAddress)} />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="metadata" className="flex-grow">
          <ScrollArea className="h-full">
            <div
              className="bg-muted p-4 rounded-md text-xs whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: formattedMetadata }}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}

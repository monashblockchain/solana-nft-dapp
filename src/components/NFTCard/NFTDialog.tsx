"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NFT } from "@/types/NFT";
import NFTDetailsTab from "./NFTDetailsTab";
import NFTMetadataTab from "./NFTMetadataTab";

interface NFTDialogProps {
  nft: NFT;
}

export default function NFTDialog({ nft }: NFTDialogProps) {
  const [selectedTab, setSelectedTab] = useState("details");

  return (
    <DialogContent className="sm:max-w-[800px] max-h-[85vh] flex flex-col bg-secondary/50 backdrop-blur-md">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold flex space-x-2 items-center">
          <p className="text-primary">
            {nft.metadata?.name || nft.name || "Unnamed NFT"}
          </p>
          <p className="text-lg text-gray-500 font-semibold">-</p>
          <p className="text-lg text-gray-500 font-semibold">
            {nft.metadata?.symbol || nft.symbol || "Unknown Symbol"}
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
            className="relative px-4 py-2 text-sm font-semibold text-gray-700 transition-colors duration-300 focus:outline-none !bg-transparent"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="metadata"
            className="relative px-4 py-2 text-sm font-semibold text-gray-700 transition-colors duration-300 focus:outline-none !bg-transparent"
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
          <NFTDetailsTab nft={nft} />
        </TabsContent>
        <TabsContent value="metadata" className="flex-grow">
          <NFTMetadataTab nft={nft} />
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}

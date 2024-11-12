"use client";

import { useState } from "react";
import { NFT } from "@/types/NFT";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AttributeList from "../NFTMinter/AttributeList";
import {
  updateV1,
  fetchMetadataFromSeeds,
} from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { useToast } from "@/hooks/use-toast";

interface NFTEditFormProps {
  nft: NFT;
  umi: any;
}

export default function NFTEditForm({ nft, umi }: NFTEditFormProps) {
  const [name, setName] = useState(nft.metadata?.name || "");
  const [description, setDescription] = useState(
    nft.metadata?.description || ""
  );
  const [symbol, setSymbol] = useState(nft.metadata?.symbol || "");
  const [attributes, setAttributes] = useState(nft.metadata?.attributes || []);
  const { toast } = useToast();

  const handleUpdate = async () => {
    try {
      const initialMetadata = await fetchMetadataFromSeeds(umi, {
        mint: new PublicKey(nft.mintAddress),
      });

      await updateV1(umi, {
        mint: new PublicKey(nft.mintAddress),
        authority: umi.identity.publicKey,
        data: {
          ...initialMetadata,
          name,
          symbol,
        },
      }).sendAndConfirm(umi);

      toast({
        title: "NFT updated successfully!",
        description: `Updated NFT with mint address: ${nft.mintAddress}`,
      });
    } catch (error) {
      console.error("Error updating NFT:", error);
      toast({
        title: "Error updating NFT",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-none shadow-md bg-secondary text-secondary-foreground mt-1"
        />
      </div>

      <div>
        <Label htmlFor="symbol">Symbol</Label>
        <Input
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border-none shadow-md bg-secondary text-secondary-foreground mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-none shadow-md bg-secondary text-secondary-foreground mt-1"
        />
      </div>

      <AttributeList attributes={attributes} setAttributes={setAttributes} />

      <Button onClick={handleUpdate} className="w-full mt-4">
        Update NFT
      </Button>
    </div>
  );
}

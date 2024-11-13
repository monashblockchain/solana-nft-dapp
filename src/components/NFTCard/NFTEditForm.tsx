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
import axios from "axios";
import { Umi } from "@metaplex-foundation/umi";

interface NFTEditFormProps {
  nft: NFT;
  umi: Umi;
}

export default function NFTEditForm({ nft, umi }: NFTEditFormProps) {
  const [name, setName] = useState(nft.metadata?.name || "");
  const [description, setDescription] = useState(
    nft.metadata?.description || ""
  );
  const [symbol, setSymbol] = useState(nft.metadata?.symbol || "");
  const [attributes, setAttributes] = useState(nft.metadata?.attributes || []);
  const [image, setImage] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);

      // Upload image to IPFS if a new image is selected
      let imageUrl = nft.metadata?.image;
      if (image) {
        const pinataApiKey = process.env.PINATA_API_KEY;
        const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

        const formData = new FormData();
        formData.append("file", image);

        const pinataImageResponse = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            headers: {
              pinata_api_key: pinataApiKey,
              pinata_secret_api_key: pinataSecretApiKey,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const imageHash = pinataImageResponse.data.IpfsHash;
        imageUrl = `https://gateway.pinata.cloud/ipfs/${imageHash}`;
      }

      // Construct updated metadata object
      const updatedMetadata = {
        name,
        description,
        symbol,
        image: imageUrl,
        attributes,
      };

      // Upload updated metadata to IPFS
      const pinataApiKey = process.env.PINATA_API_KEY;
      const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
      const pinataMetadataResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        updatedMetadata,
        {
          headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
            "Content-Type": "application/json",
          },
        }
      );

      const metadataHash = pinataMetadataResponse.data.IpfsHash;
      const metadataUri = `https://gateway.pinata.cloud/ipfs/${metadataHash}`;

      // Fetch initial metadata and update with new URI
      const mint = new PublicKey(nft.mintAddress);
      const initialMetadata = await fetchMetadataFromSeeds(umi, { mint });

      await updateV1(umi, {
        mint,
        authority: umi.identity.publicKey,
        data: {
          ...initialMetadata,
          name,
          symbol,
          uri: metadataUri,
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
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (e: any) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
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

      <div>
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="bg-secondary text-secondary-foreground border-none shadow py-2 mt-1"
        />
      </div>

      <Button
        onClick={handleUpdate}
        className="w-full mt-4"
        disabled={isUpdating}
      >
        {isUpdating ? "Updating..." : "Update NFT"}
      </Button>
    </div>
  );
}

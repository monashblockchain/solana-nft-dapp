"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import fs from "fs";
import path from "path";

export default function NFTMinter() {
  const { publicKey, wallet } = useWallet();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleMint = async () => {
    if (!publicKey || !wallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }
    if (!name || !symbol || !description || !image) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsMinting(true);

    try {
      // Step 1: Set up Umi and register mplTokenMetadata
      const umi = createUmi("https://api.devnet.solana.com")
        .use(mplTokenMetadata()) // Ensure mpl-token-metadata is registered
        .use(irysUploader({ address: "https://devnet.irys.xyz" }))
        .use(walletAdapterIdentity(wallet.adapter)); // Use wallet.adapter here

      const imageArrayBuffer = await image.arrayBuffer();
      const imageUint8Array = new Uint8Array(imageArrayBuffer);

      // Use `createGenericFile` to transform the file into a `GenericFile` type
      // that umi can understand. Make sure you set the mimi tag type correctly
      // otherwise Arweave will not know how to display your image.

      const umiImageFile = createGenericFile(imageUint8Array, image.name, {
        tags: [{ name: "Content-Type", value: "image/jpg" }],
      });

      // Here we upload the image to Arweave via Irys and we get returned a uri
      // address where the file is located. You can log this out but as the
      // uploader can takes an array of files it also returns an array of uris.
      // To get the uri we want we can call index [0] in the array.

      console.log("Uploading image...");
      const imageUri = await umi.uploader.upload([umiImageFile]);

      console.log("Image uploaded to:", imageUri);

      //
      // ** Upload Metadata to Arweave **
      //

      const metadata = {
        name: name,
        description: description,
        image: imageUri[0],
        symbol: symbol,
        //external_url: "https://example.com",
        attributes: [
          {
            trait_type: "difficulty",
            value: "impossible",
          },
          {
            trait_type: "satisfaction",
            value: "guaranteed",
          },
        ],
        properties: {
          files: [
            {
              uri: imageUri[0],
              type: "image/jpeg",
            },
          ],
          category: "image",
        },
      };

      // Call upon umi's uploadJson function to upload our metadata to Arweave via Irys.
      console.log("Uploading metadata...");
      const metadataUri = await umi.uploader.uploadJson(metadata);

      //
      // ** Creating the Nft **
      //

      // We generate a signer for the Nft
      const nftSigner = generateSigner(umi);

      // Decide on a ruleset for the Nft.
      const ruleset = null;

      console.log("Creating Nft...");
      const tx = await createNft(umi, {
        mint: nftSigner,
        sellerFeeBasisPoints: percentAmount(0),
        name: metadata.name,
        uri: metadataUri,
        ruleSet: ruleset,
      }).sendAndConfirm(umi);

      // Finally we can deserialize the signature that we can check on chain.
      const signature = base58.deserialize(tx.signature)[0];

      // Log out the signature and the links to the transaction and the NFT.
      console.log("\npNFT Created");
      console.log("View Transaction on Solana Explorer");
      console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      console.log("\n");
      console.log("View NFT on Metaplex Explorer");
      console.log(
        `https://explorer.solana.com/address/${nftSigner.publicKey}?cluster=devnet`
      );

      toast({
        title: "NFT minted successfully!",
        description: `Mint address: ${nftSigner.publicKey}`,
      });

      setName("");
      setSymbol("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Error minting NFT",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Mint your NFT</CardTitle>
        <CardDescription>
          Connect your wallet and fill in the details to mint your NFT.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
          </div>
          <Button
            className="w-full"
            onClick={handleMint}
            disabled={!publicKey || isMinting}
          >
            {isMinting ? "Minting..." : "Mint NFT"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <WalletMultiButton />
      </CardFooter>
    </Card>
  );
}

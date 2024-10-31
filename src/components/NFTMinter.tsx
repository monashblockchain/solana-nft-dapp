"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import axios from "axios";
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

export default function NFTMinter() {
  const { publicKey, wallet } = useWallet();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [transactionLink, setTransactionLink] = useState("");
  const [metadataUri, setMetadataUri] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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
      // Step 1: Upload Image to Pinata
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
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageHash}`;
      setImageUrl(imageUrl);
      console.log("Image uploaded to IPFS at:", imageUrl);

      // Step 2: Upload Metadata to Pinata
      const metadata = {
        name: name,
        symbol: symbol,
        description: description,
        image: imageUrl, // Gateway URL for accessibility
        attributes: [
          {
            trait_type: "What is he",
            value: "A business student LOOOLLL",
          },
        ],
        properties: {
          files: [{ uri: imageUrl, type: image.type }],
          category: "image",
        },
      };

      const pinataMetadataResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
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
      setMetadataUri(metadataUri);
      console.log("Metadata uploaded to IPFS at:", metadataUri);

      // Step 3: Mint NFT using the Metadata URI
      const umi = createUmi("https://api.devnet.solana.com")
        .use(mplTokenMetadata())
        .use(walletAdapterIdentity(wallet.adapter));

      const nftSigner = generateSigner(umi);

      const tx = await createNft(umi, {
        mint: nftSigner,
        sellerFeeBasisPoints: percentAmount(0),
        name: metadata.name,
        uri: metadataUri,
      }).sendAndConfirm(umi);

      const signature = base58.deserialize(tx.signature)[0];
      const transactionLink = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
      setTransactionLink(transactionLink);

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

          {/* Display Minted NFT Details */}
          {transactionLink && (
            <div className="mt-4">
              <p>
                <strong>Transaction Link:</strong>{" "}
                <a
                  href={transactionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Solana Explorer
                </a>
              </p>
              <p>
                <strong>Image URL:</strong>{" "}
                <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                  View Image on IPFS
                </a>
              </p>
              <p>
                <strong>Metadata URL:</strong>{" "}
                <a href={metadataUri} target="_blank" rel="noopener noreferrer">
                  View Metadata on IPFS
                </a>
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <WalletMultiButton />
      </CardFooter>
    </Card>
  );
}

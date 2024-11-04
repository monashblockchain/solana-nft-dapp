"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { create, mplCore } from "@metaplex-foundation/mpl-core";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import NFTForm from "./NFTForm";
import MintInfo from "./MintInfo";

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
  const [useCore, setUseCore] = useState(false); // Toggle between Core and Token Metadata
  const [attributes, setAttributes] = useState([{ trait_type: "", value: "" }]);
  const { toast } = useToast();

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

      const metadata = {
        name,
        description,
        symbol,
        image: imageUrl,
        attributes,
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

      const umi = createUmi("https://api.devnet.solana.com")
        .use(useCore ? mplCore() : mplTokenMetadata())
        .use(walletAdapterIdentity(wallet.adapter));

      const assetOrMint = generateSigner(umi);

      let tx;
      if (useCore) {
        tx = await create(umi, {
          asset: assetOrMint,
          name: metadata.name,
          uri: metadataUri,
        }).sendAndConfirm(umi);
      } else {
        tx = await createNft(umi, {
          mint: assetOrMint,
          sellerFeeBasisPoints: percentAmount(0),
          name: metadata.name,
          uri: metadataUri,
        }).sendAndConfirm(umi);
      }

      const signature = base58.deserialize(tx.signature)[0];
      const transactionLink = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
      setTransactionLink(transactionLink);

      toast({
        title: "NFT minted successfully!",
        description: `Mint address: ${assetOrMint.publicKey}`,
      });

      setName("");
      setSymbol("");
      setDescription("");
      setImage(null);
      setAttributes([{ trait_type: "", value: "" }]);
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
          Connect your wallet, choose standard, and fill in the details to mint
          your NFT.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NFTForm
          name={name}
          setName={setName}
          symbol={symbol}
          setSymbol={setSymbol}
          description={description}
          setDescription={setDescription}
          image={image}
          setImage={setImage}
          useCore={useCore}
          setUseCore={setUseCore}
          publicKey={publicKey}
          attributes={attributes}
          setAttributes={setAttributes}
        />
        <Button
          className="w-full mt-4"
          onClick={handleMint}
          disabled={!publicKey || isMinting}
        >
          {isMinting ? "Minting..." : "Mint NFT"}
        </Button>
        <MintInfo
          transactionLink={transactionLink}
          imageUrl={imageUrl}
          metadataUri={metadataUri}
        />
      </CardContent>
    </Card>
  );
}

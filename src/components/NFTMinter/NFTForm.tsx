import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AttributeList from "./AttributeList";
import { useState } from "react";
import Image from "next/image";

interface NFTFormProps {
  name: string;
  setName: (value: string) => void;
  symbol: string;
  setSymbol: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  image: File | null;
  setImage: (file: File | null) => void;
  tokenStandard: string;
  setTokenStandard: (value: string) => void;
  publicKey: string | null;
  attributes: { trait_type: string; value: string }[];
  setAttributes: (attributes: { trait_type: string; value: string }[]) => void;
}

export default function NFTForm({
  name,
  setName,
  symbol,
  setSymbol,
  description,
  setDescription,
  image,
  setImage,
  tokenStandard,
  setTokenStandard,
  publicKey,
  attributes,
  setAttributes,
}: NFTFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 justify-between">
        <Button
          onClick={() => setTokenStandard("Metadata")}
          disabled={!publicKey}
          className={`w-full ${
            tokenStandard === "Metadata"
              ? "bg-primary text-primary-foreground hover:bg-primary-dark"
              : "bg-secondary text-secondary-foreground hover:bg-secondary-dark"
          }`}
        >
          Token Metadata
        </Button>
        <Button
          onClick={() => setTokenStandard("Core")}
          disabled={!publicKey}
          className={`w-full ${
            tokenStandard === "Core"
              ? "bg-primary text-primary-foreground hover:bg-primary-dark"
              : "bg-secondary text-secondary-foreground hover:bg-secondary-dark"
          }`}
        >
          Core
        </Button>
        <Button
          onClick={() => setTokenStandard("Token-2022")}
          disabled={!publicKey}
          className={`w-full ${
            tokenStandard === "Token-2022"
              ? "bg-primary text-primary-foreground hover:bg-primary-dark"
              : "bg-secondary text-secondary-foreground hover:bg-secondary-dark"
          }`}
        >
          Token-2022
        </Button>
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border-none shadow-md bg-secondary text-secondary-foreground mt-1"
        />
      </div>

      <div>
        <Label htmlFor="symbol">Symbol</Label>
        <Input
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          required
          className="border-none shadow-md bg-secondary text-secondary-foreground mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
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
          required
          className="bg-secondary text-secondary-foreground border-none shadow py-2 mt-1"
        />
        {imagePreview && (
          <Image
            src={imagePreview}
            alt="Selected preview"
            width={96}
            height={96}
            className="object-cover rounded-md border mx-auto mt-3 w-1/2"
          />
        )}
      </div>
    </div>
  );
}

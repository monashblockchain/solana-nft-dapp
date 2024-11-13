import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AttributeList from "./AttributeList";
import { PublicKey } from "@solana/web3.js";

export interface NFTFormProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  symbol: string;
  setSymbol: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  tokenStandard: string;
  setTokenStandard: React.Dispatch<React.SetStateAction<string>>;
  publicKey: PublicKey | null;
  attributes: { trait_type: string; value: string }[];
  setAttributes: React.Dispatch<
    React.SetStateAction<{ trait_type: string; value: string }[]>
  >;
  royalty: number;
  setRoyalty: React.Dispatch<React.SetStateAction<number>>;
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
  royalty,
  setRoyalty,
}: NFTFormProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
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

      <AttributeList attributes={attributes} setAttributes={setAttributes} />

      <div>
        <Label htmlFor="royalty">Royalty</Label>
        <Input
          id="royalty"
          type="number"
          value={royalty}
          onChange={(e) => setRoyalty(Number(e.target.value))}
          className="border-none shadow-md bg-secondary text-secondary-foreground mt-1"
        />
      </div>
    </div>
  );
}

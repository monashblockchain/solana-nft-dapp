import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AttributeList from "./AttributeList";

export default function NFTForm({
  name,
  setName,
  symbol,
  setSymbol,
  description,
  setDescription,
  image,
  setImage,
  useCore,
  setUseCore,
  publicKey,
  attributes,
  setAttributes,
}) {
  const handleImageChange = (e) => {
    if (e.target.files) setImage(e.target.files[0]);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 justify-between">
        <Button
          onClick={() => setUseCore(false)}
          disabled={!publicKey}
          className={`w-full ${
            !useCore
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          Use Token Metadata
        </Button>
        <Button
          onClick={() => setUseCore(true)}
          disabled={!publicKey}
          className={`w-full ${
            useCore
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          Use Core
        </Button>
      </div>

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

      <AttributeList attributes={attributes} setAttributes={setAttributes} />

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
    </div>
  );
}

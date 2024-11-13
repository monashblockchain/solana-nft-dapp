import { useState } from "react";
import { NFT } from "@/types/NFT";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface NFTMetadataTabProps {
  nft: NFT;
}

export default function NFTMetadataTab({ nft }: NFTMetadataTabProps) {
  const [copied, setCopied] = useState(false);

  if (!nft.root)
    return (
      <div className="h-full flex items-center justify-center text-gray-500 mt-4">
        No metadata available
      </div>
    );

  const formattedMetadata = JSON.stringify(nft.root, null, 2)
    .replace(/"([^"]+)":/g, `"<span class="text-primary/85">$1</span>":`) // Color keys
    .replace(/: "(.*?)"/g, `: "<span class="text-orange-300">$1</span>"`) // Color string values
    .replace(/: (\d+)/g, `: <span class="text-orange-300">$1</span>`) // Color numeric values
    .replace(/: (true|false)/g, `: <span class="text-orange-300">$1</span>`); // Color boolean values

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(nft.root, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative h-full">
      {/* Copy Button */}
      <Button
        onClick={handleCopy}
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 hover:bg-transparent"
      >
        {copied ? (
          <Check className="h-5 w-5 text-primary" />
        ) : (
          <Copy className="h-5 w-5 text-primary" />
        )}
      </Button>

      <ScrollArea className="h-full">
        <div
          className="bg-muted/30 p-4 rounded-md text-sm whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: formattedMetadata }}
        />
      </ScrollArea>
    </div>
  );
}

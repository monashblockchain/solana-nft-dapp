import { NFT } from "@/types/NFT";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NFTMetadataTabProps {
  nft: NFT;
}

export default function NFTMetadataTab({ nft }: NFTMetadataTabProps) {
  // Format metadata as color-coded JSON string
  const formattedMetadata = JSON.stringify(nft.root, null, 2)
    .replace(/"([^"]+)":/g, `"<span class="text-primary">$1</span>":`) // Color keys
    .replace(/: "(.*?)"/g, `: "<span class="text-orange-300">$1</span>"`) // Color string values
    .replace(/: (\d+)/g, `: <span class="text-orange-300">$1</span>`) // Color numeric values
    .replace(/: (true|false)/g, `: <span class="text-orange-300">$1</span>`); // Color boolean values

  return (
    <ScrollArea className="h-full">
      <div
        className="bg-muted/30 p-4 rounded-md text-sm whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: formattedMetadata }}
      />
    </ScrollArea>
  );
}

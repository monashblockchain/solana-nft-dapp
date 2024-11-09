import { NFT } from "@/types/NFT";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NFTMetadataTabProps {
  nft: NFT;
}

export default function NFTMetadataTab({ nft }: NFTMetadataTabProps) {
  // Format metadata as color-coded JSON string
  const formattedMetadata = JSON.stringify(nft.root, null, 2)
    .replace(/"([^"]+)":/g, `"<span class="text-primary">$1</span>":`) // Color keys
    .replace(/: "(.*?)"/g, `: "<span class="text-muted-foreground">$1</span>"`) // Color string values
    .replace(/: (\d+)/g, `: <span class="text-muted-foreground">$1</span>`); // Color numeric values

  return (
    <ScrollArea className="h-full">
      <div
        className="bg-muted p-4 rounded-md text-xs whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: formattedMetadata }}
      />
    </ScrollArea>
  );
}

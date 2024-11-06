import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface NFT {
  mintAddress: string;
  metadata?: {
    image?: string;
    name?: string;
    description?: string;
  };
}

interface NFTGalleryProps {
  nfts: NFT[];
}

export default function NFTGallery({ nfts }: NFTGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
      {nfts.map((nft) => (
        <Card
          key={nft.mintAddress}
          className="overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
          <div className="relative h-48 w-full">
            <img
              src={nft.metadata?.image || "/placeholder.jpg"}
              alt={nft.metadata?.name || "NFT"}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.jpg";
              }}
            />
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2 truncate">
              {nft.metadata?.name || "Unnamed NFT"}
            </h3>
            {nft.metadata?.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {nft.metadata.description}
              </p>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 p-2 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              ID: {nft.mintAddress.slice(0, 8)}...
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

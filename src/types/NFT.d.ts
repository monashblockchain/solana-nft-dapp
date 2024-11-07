export interface NFT {
  mintAddress: string;
  metadata?: {
    image?: string;
    name?: string;
    description?: string;
  };
}

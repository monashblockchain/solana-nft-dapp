export interface NFT {
  name: string;
  symbol: string;
  description: string;
  mintAddress: string;
  metadata?: json;
  error?: Error;
}

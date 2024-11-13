export interface NFT {
  root: {
    key: number; // Key of the metadata or asset
    updateAuthority: PublicKey | undefined; // Authority for updating the metadata or asset
    mint: string; // Mint address of the NFT
    data: {
      name: string; // Name of the asset
      symbol: string; // Symbol of the asset
      uri: string; // URI for additional metadata
      sellerFeeBasisPoints: number; // Royalty fee in basis points
      creators: { address: string; percentage: number }[]; // Array of creators
    };
    primarySaleHappened?: boolean; // Flag for primary sale status
    isMutable?: boolean; // Flag for mutability
    editionNonce?: number | null; // Nonce for editions
    tokenStandard?: string | null; // Standard of the token (e.g., NonFungible, Fungible, etc.)
  };
  name: string; // Human-readable name of the asset
  symbol: string; // Symbol for the asset
  mintAddress: string; // Address of the mint
  metadata?: {
    name?: string; // Optional name
    symbol?: string; // Optional symbol
    description?: string; // Optional description
    attributes?: { trait_type: string; value: string }[]; // Optional attributes
    image?: string; // Optional image URI
  };
  type: "token-metadata" | "core"; // Type of the NFT
}

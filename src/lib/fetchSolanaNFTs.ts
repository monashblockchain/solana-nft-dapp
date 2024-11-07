import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";

export async function fetchSolanaNFTs(walletAddress: string) {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  const metaplex = new Metaplex(connection);

  try {
    const publicKey = new PublicKey(walletAddress);
    const nfts = await metaplex.nfts().findAllByOwner({ owner: publicKey });

    const nftMetadata = await Promise.all(
      nfts.map(async (nft) => {
        try {
          let metadata = null;
          if (nft.uri) {
            const response = await fetch(nft.uri);
            metadata = await response.json();
            console.log(metadata);
          }

          return {
            name: nft.name,
            symbol: nft.symbol,
            mintAddress: nft.mintAddress.toString(),
            uri: nft.uri,
            metadata, // includes image, description, and attributes
            error: null,
          };
        } catch (error) {
          console.error(`Failed to fetch metadata for NFT ${nft.name}`, error);
          return {
            name: nft.name,
            symbol: nft.symbol,
            mintAddress: nft.mintAddress.toString(),
            uri: nft.uri,
            metadata: null, // Set metadata to null if fetching fails
            error,
          };
        }
      })
    );

    const filteredNftMetadata = nftMetadata.filter((nft) => nft.error === null);
    return filteredNftMetadata;
  } catch (error) {
    console.error("Failed to fetch Solana NFTs using Metaplex SDK:", error);
    return [];
  }
}

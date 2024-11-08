import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fetchAllDigitalAssetByOwner } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey as createPublicKey } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { WalletAdapter } from "@solana/wallet-adapter-base";
import { PublicKey } from "@solana/web3.js";

export async function fetchTokenMetadataAssets(
  publicKey: PublicKey,
  walletAdapter: WalletAdapter
) {
  const umi = createUmi("https://api.devnet.solana.com").use(
    walletAdapterIdentity(walletAdapter)
  );
  const ownerPublicKey = createPublicKey(publicKey.toString());

  try {
    const assets = await fetchAllDigitalAssetByOwner(umi, ownerPublicKey);

    const assetMetadata = await Promise.all(
      assets.map(async (asset) => {
        let metadata = null;
        if (asset.metadata?.uri) {
          try {
            const response = await fetch(asset.metadata.uri);
            if (response.ok) {
              metadata = await response.json();
            } else {
              console.error("Failed to fetch metadata:", response.statusText);
            }
          } catch (error) {
            console.error(
              "Error fetching metadata from URI:",
              asset.metadata.uri,
              error
            );
          }
        }

        return {
          name: asset.metadata.name || "Unnamed",
          symbol: asset.metadata.symbol || "N/A",
          mintAddress: asset.publicKey.toString(),
          metadata, // includes image, description, and attributes
          type: "token-metadata" as const,
        };
      })
    );

    return assetMetadata.filter((asset) => asset.metadata !== null);
  } catch (error) {
    console.error("Failed to fetch Token Metadata NFTs:", error);
    return [];
  }
}

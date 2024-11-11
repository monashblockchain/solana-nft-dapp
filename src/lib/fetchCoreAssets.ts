import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fetchAssetsByOwner } from "@metaplex-foundation/mpl-core";
import { publicKey as createPublicKey } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { PublicKey } from "@solana/web3.js";
import { WalletAdapter } from "@solana/wallet-adapter-base";

export async function fetchCoreAssets(
  publicKey: PublicKey,
  walletAdapter: WalletAdapter
) {
  const umi = createUmi("https://api.devnet.solana.com").use(
    walletAdapterIdentity(walletAdapter)
  );
  const ownerPublicKey = createPublicKey(publicKey.toString());

  try {
    const assets = await fetchAssetsByOwner(umi, ownerPublicKey, {
      skipDerivePlugins: false,
    });

    const assetMetadata = await Promise.all(
      assets.map(async (asset) => {
        // Fetch additional metadata from the URI
        let fetchedData = null;
        if (asset.uri) {
          try {
            const response = await fetch(asset.uri);
            if (response.ok) {
              fetchedData = await response.json();
            } else {
              console.error("Failed to fetch metadata:", response.statusText);
            }
          } catch (error) {
            console.error(
              "Error fetching metadata from URI:",
              asset.uri,
              error
            );
          }
        }

        // Build an object that mirrors the Solana Explorer structure
        return {
          root: {
            key: asset.key,
            updateAuthority: asset.updateAuthority.address,
            mint: asset.publicKey.toString(),
            data: {
              name: asset.name || "",
              symbol: fetchedData.symbol || "",
              uri: asset.uri,
              sellerFeeBasisPoints: asset.royalties?.basisPoints || 0,
              creators: asset.royalties?.creators || [],
            },
          },
          name: asset.name || "Unnamed",
          symbol: fetchedData.symbol || "N/A",
          mintAddress: asset.publicKey.toString(),
          metadata: fetchedData, // This includes image, description, attributes, etc.
          type: "core" as const,
        };
      })
    );

    return assetMetadata;
  } catch (error) {
    console.error("Failed to fetch Explorer-style Core Assets:", error);
    return [];
  }
}

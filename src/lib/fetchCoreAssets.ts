import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fetchAssetsByOwner } from "@metaplex-foundation/mpl-core";
import { publicKey as createPublicKey } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { WalletAdapter } from "@solana/wallet-adapter-base";
import { PublicKey } from "@solana/web3.js";

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
        let metadata = null;
        if (asset.uri) {
          try {
            const response = await fetch(asset.uri);
            metadata = await response.json();
          } catch (error) {
            console.error("Failed to fetch metadata from URI:", asset.uri);
          }
        }

        return {
          name: asset.name,
          symbol: asset.symbol,
          mintAddress: asset.publicKey.toString(),
          metadata, // includes image, description, and attributes
          type: "core" as const,
        };
      })
    );

    return assetMetadata;
  } catch (error) {
    console.error("Failed to fetch Core Assets:", error);
    return [];
  }
}

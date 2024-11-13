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
        // Fetch additional metadata from the URI
        let fetchedData = null;
        if (asset.metadata?.uri) {
          try {
            const response = await fetch(asset.metadata.uri);
            if (response.ok) {
              fetchedData = await response.json();
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

        // Build an object that mirrors the Solana Explorer structure
        return {
          root: {
            key: asset.metadata.key,
            updateAuthority: asset.metadata.updateAuthority,
            mint: asset.metadata.mint,
            data: {
              name: asset.metadata.name || fetchedData?.name || "",
              symbol: asset.metadata.symbol || fetchedData?.symbol || "",
              uri: asset.metadata.uri,
              sellerFeeBasisPoints: asset.metadata.sellerFeeBasisPoints || 0,
              // @ts-expect-error: Suppress type error for creators
              creators: asset.metadata.creators?.value || [],
            },
            primarySaleHappened: asset.metadata.primarySaleHappened,
            isMutable: asset.metadata.isMutable,
            // @ts-expect-error: Suppress type error for editionNonce
            editionNonce: asset.metadata.editionNonce?.value || null,
            //
            tokenStandard:
              asset.metadata.tokenStandard !== null &&
              asset.metadata.tokenStandard !== undefined
                ? // @ts-expect-error: Suppress type error for tokenStandard
                  asset.metadata.tokenStandard.value
                : null,
          },
          name: asset.metadata.name || fetchedData?.name || "",
          symbol: asset.metadata.symbol || fetchedData?.symbol || "",
          mintAddress: asset.metadata.mint,
          metadata: fetchedData, // This includes description, attributes, image, etc.
          type: "token-metadata" as const,
        };
      })
    );

    return assetMetadata;
  } catch (error) {
    console.error("Failed to fetch Explorer-style Token Metadata NFTs:", error);
    return [];
  }
}

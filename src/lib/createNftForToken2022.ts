import {
  createV1,
  mintV1,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  generateSigner,
  percentAmount,
  publicKey,
  PublicKey,
} from "@metaplex-foundation/umi";
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";

const SPL_TOKEN_2022_PROGRAM_ID: PublicKey = publicKey(
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
);

/**
 * Function to create an NFT using Token-2022 standards
 * @param umi - Umi instance for transaction setup
 * @param mint - PublicKey of the mint account
 * @param metadataUri - URI for metadata
 * @param name - Name of the NFT
 * @param sellerFeeBasisPoints - Fee in basis points (e.g., 5.5% as 5.5)
 * @returns Transaction signature
 */
export async function createNftForToken2022(
  umi,
  { name, uri: metadataUri, sellerFeeBasisPoints }
) {
  const walletPublicKey = umi.identity.publicKey;
  const mint = generateSigner(umi);

  // Step 1: Create metadata for the NFT using createV1
  await createV1(umi, {
    mint,
    authority: walletPublicKey,
    name,
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoints),
    splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
    tokenStandard: TokenStandard.NonFungible,
  }).sendAndConfirm(umi);

  // Step 2: Find the associated token account for the mint
  const token = findAssociatedTokenPda(umi, {
    mint: mint.publicKey,
    owner: walletPublicKey,
    tokenProgramId: SPL_TOKEN_2022_PROGRAM_ID,
  });

  // Step 3: Mint the NFT token to the associated token account
  const tx = await mintV1(umi, {
    mint: mint.publicKey,
    token,
    authority: walletPublicKey,
    amount: 1, // Mint exactly 1 token for the NFT
    tokenOwner: walletPublicKey,
    splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
    tokenStandard: TokenStandard.NonFungible,
  }).sendAndConfirm(umi);

  return tx.signature;
}

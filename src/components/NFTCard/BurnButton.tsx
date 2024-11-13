"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flame, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  burnV1 as burnTokenMetadataV1,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { burn as burnCore, fetchAsset } from "@metaplex-foundation/mpl-core";
import { publicKey as createPublicKey } from "@metaplex-foundation/umi";
import { NFT } from "@/types/NFT";
import { useToast } from "@/hooks/use-toast";
import { Umi } from "@metaplex-foundation/umi";

interface BurnButtonProps {
  nft: NFT;
  umi: Umi;
  owner: any;
}

export default function BurnButton({ nft, umi, owner }: BurnButtonProps) {
  const { toast } = useToast();
  const [showBurnConfirm, setShowBurnConfirm] = useState(false);

  const handleBurn = async () => {
    try {
      if (nft.type === "token-metadata") {
        // Token Metadata NFT burn
        const mint = createPublicKey(nft.mintAddress);
        await burnTokenMetadataV1(umi, {
          mint,
          authority: umi.identity,
          tokenOwner: createPublicKey(owner.publicKey),
          tokenStandard: TokenStandard.NonFungible,
        }).sendAndConfirm(umi);
      } else if (nft.type === "core") {
        // Core Asset NFT burn
        const assetId = createPublicKey(nft.mintAddress);
        const asset = await fetchAsset(umi, assetId);
        await burnCore(umi, {
          asset,
        }).sendAndConfirm(umi);
      }

      toast({
        title: "Success",
        description: "NFT burned successfully!",
      });
      setShowBurnConfirm(false);
    } catch (error) {
      console.error("Error burning NFT:", error);
      toast({
        title: "Error",
        description: "Failed to burn NFT. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <AnimatePresence mode="wait" initial={false}>
        {!showBurnConfirm ? (
          <motion.div
            key="burn-icon"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Button
              variant="outline"
              onClick={() => setShowBurnConfirm(true)}
              className="rounded-full w-16 h-16 bg-destructive/10 hover:bg-destructive/20 text-destructive border-none"
            >
              <Flame className="!h-8 !w-8" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="burn-confirm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col items-center space-y-2"
          >
            <p className="text-sm text-muted-foreground mb-2">Burn this NFT?</p>
            <div className="flex space-x-2">
              <motion.div
                key="confirm-burn"
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: -20, opacity: 1 }}
                exit={{ x: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Button
                  variant="destructive"
                  onClick={handleBurn}
                  className="rounded-full w-12 h-12"
                >
                  <Flame className="h-6 w-6" />
                </Button>
              </motion.div>
              <motion.div
                key="cancel-burn"
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: 20, opacity: 1 }}
                exit={{ x: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Button
                  variant="outline"
                  onClick={() => setShowBurnConfirm(false)}
                  className="rounded-full w-12 h-12"
                >
                  <X />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

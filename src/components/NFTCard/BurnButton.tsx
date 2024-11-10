"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flame, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { burnV1 } from "@metaplex-foundation/mpl-token-metadata";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { NFT } from "@/types/NFT";

interface BurnButtonProps {
  nft: NFT;
  umi: any;
  owner: any;
}

export default function BurnButton({ nft, umi, owner }: BurnButtonProps) {
  const [showBurnConfirm, setShowBurnConfirm] = useState(false);

  const handleBurn = async () => {
    const mint = new PublicKey(nft.mintAddress);

    await burnV1(umi, {
      mint,
      authority: owner,
      tokenOwner: owner.publicKey,
      tokenStandard: TokenStandard.NonFungible,
    }).sendAndConfirm(umi);
    setShowBurnConfirm(false);
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

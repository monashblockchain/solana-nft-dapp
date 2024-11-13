"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { NFT } from "@/types/NFT";
import { transferV1 as transferMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { transferV1 as transferCore } from "@metaplex-foundation/mpl-core";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey as createPublicKey } from "@metaplex-foundation/umi";

interface TransferButtonProps {
  nft: NFT;
  umi: any;
  owner: any;
}

export default function TransferButton({
  nft,
  umi,
  owner,
}: TransferButtonProps) {
  const [showTransferConfirm, setShowTransferConfirm] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    setIsTransferring(true);

    try {
      const mint = createPublicKey(nft.mintAddress);
      const destinationOwner = createPublicKey(recipientAddress);

      if (nft.type === "token-metadata") {
        await transferMetadata(umi, {
          mint,
          authority: owner.publicKey,
          tokenOwner: owner.publicKey,
          destinationOwner,
          tokenStandard: TokenStandard.NonFungible,
        }).sendAndConfirm(umi);
      } else if (nft.type === "core") {
        await transferCore(umi, {
          asset: mint,
          newOwner: destinationOwner,
        }).sendAndConfirm(umi);
      }

      alert("NFT transferred successfully!");
      setShowTransferConfirm(false);
    } catch (error) {
      console.error("Error transferring NFT:", error);
      alert("Transfer failed. Please try again.");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <AnimatePresence mode="wait" initial={false}>
        {!showTransferConfirm ? (
          <motion.div
            key="transfer-icon"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Button
              variant="outline"
              onClick={() => setShowTransferConfirm(true)}
              className="rounded-full w-16 h-16 bg-primary/10 hover:bg-primary/20 text-primary border-none"
            >
              <Send className="!h-7 !w-7 mr-0.5 mt-0.5" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="transfer-confirm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col items-center space-y-2"
          >
            <p className="text-sm text-muted-foreground mb-2">
              Transfer this NFT?
            </p>
            <Input
              placeholder="Wallet Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="text-sm mb-2 w-40"
            />
            <div className="flex space-x-2">
              <motion.div
                key="confirm-transfer"
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: -20, opacity: 1 }}
                exit={{ x: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Button
                  onClick={handleTransfer}
                  disabled={!recipientAddress || isTransferring}
                  className="rounded-full w-12 h-12"
                >
                  {isTransferring ? "..." : <Send className="h-6 w-6" />}
                </Button>
              </motion.div>
              <motion.div
                key="cancel-transfer"
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: 20, opacity: 1 }}
                exit={{ x: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Button
                  variant="outline"
                  onClick={() => setShowTransferConfirm(false)}
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

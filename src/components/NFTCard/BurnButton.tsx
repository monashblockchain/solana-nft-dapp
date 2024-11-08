"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flame, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BurnButtonProps {
  onBurn: () => void;
}

export default function BurnButton({ onBurn }: BurnButtonProps) {
  const [showBurnConfirm, setShowBurnConfirm] = useState(false);

  const handleBurn = () => {
    onBurn();
    setShowBurnConfirm(false);
  };

  return (
    <AnimatePresence>
      {!showBurnConfirm ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Button
            variant="outline"
            onClick={() => setShowBurnConfirm(true)}
            className="rounded-full w-16 h-16 bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive border-none"
          >
            <Flame className="!h-8 !w-8" />
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-2">Burn this NFT?</p>
          <div className="flex space-x-2 justify-center">
            <Button
              variant="destructive"
              onClick={handleBurn}
              className="rounded-full w-12 h-12"
            >
              <Flame className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowBurnConfirm(false)}
              className="rounded-full w-12 h-12"
            >
              <X />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

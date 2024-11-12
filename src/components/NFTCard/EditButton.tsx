"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NFTEditForm from "./NFTEditForm";
import { NFT } from "@/types/NFT";
import { Umi } from "@metaplex-foundation/umi";

interface EditButtonProps {
  nft: NFT;
  umi: Umi;
}

export default function EditButton({ nft, umi }: EditButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full w-16 h-16 bg-muted/50 hover:bg-muted/70 text-muted-foreground border-none"
        >
          <Edit className="!h-7 !w-7" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-secondary/50 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Edit NFT</DialogTitle>
        </DialogHeader>
        <NFTEditForm nft={nft} umi={umi} />
      </DialogContent>
    </Dialog>
  );
}

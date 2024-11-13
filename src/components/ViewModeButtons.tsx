import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Grid, Columns, List } from "lucide-react";

interface ViewModeButtonsProps {
  viewMode: "large" | "small" | "list";
  setViewMode: Dispatch<SetStateAction<"large" | "small" | "list">>;
}

export default function ViewModeButtons({
  viewMode,
  setViewMode,
}: ViewModeButtonsProps) {
  return (
    <div className="flex space-x-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setViewMode("large")}
        className={
          viewMode === "large" ? "bg-primary text-primary-foreground" : ""
        }
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setViewMode("small")}
        className={
          viewMode === "small" ? "bg-primary text-primary-foreground" : ""
        }
      >
        <Columns className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setViewMode("list")}
        className={
          viewMode === "list" ? "bg-primary text-primary-foreground" : ""
        }
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}

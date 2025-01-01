import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";

type SummaryLength = "brief" | "balanced" | "thorough";

interface SettingsMenuProps {
  onLengthChange: (length: SummaryLength) => void;
}

export function SettingsMenu({ onLengthChange }: SettingsMenuProps) {
  const [activeLength, setActiveLength] = useState<SummaryLength>("balanced");

  const handleLengthChange = (length: SummaryLength) => {
    setActiveLength(length);
    onLengthChange(length);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Open settings menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Summary Length</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleLengthChange("brief")}
          className={activeLength === "brief" ? "bg-muted" : ""}
        >
          Brief
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLengthChange("balanced")}
          className={activeLength === "balanced" ? "bg-muted" : ""}
        >
          Balanced
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLengthChange("thorough")}
          className={activeLength === "thorough" ? "bg-muted" : ""}
        >
          Thorough
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

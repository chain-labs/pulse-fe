"use client";

import { useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MODE_BG_COLORS, useLocalStorage } from "@/stores/localstorage";

export default function ModeSelection() {
  const modeData = useLocalStorage();
  const mode = modeData.mode.replace(/[^a-zA-Z ]/g, "") as
    | "date"
    | "network"
    | "invest";
  useEffect(() => {
    if (typeof window === "undefined") return;
    modeData.setMode(mode as "date" | "network" | "invest");
  }, []);
  console.log("modeData", mode);
  return (
    <Select
      value={mode}
      onValueChange={(value: "date" | "network" | "invest") => {
        modeData?.setMode(value);
      }}
    >
      <SelectTrigger
        style={{ backgroundColor: "var(--app-background)" }}
        className={cn(`gap-4 rounded-full bg-[${MODE_BG_COLORS[mode]}]`)}
      >
        <SelectValue placeholder="Mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          value="date"
          style={{
            backgroundColor:
              modeData.mode === "date" ? MODE_BG_COLORS.date : "transparent",
          }}
        >
          Date
        </SelectItem>
        <SelectItem
          style={{
            backgroundColor:
              modeData.mode === "network"
                ? MODE_BG_COLORS.network
                : "transparent",
          }}
          value="network"
        >
          Network
        </SelectItem>
        <SelectItem
          style={{
            backgroundColor:
              modeData.mode === "invest"
                ? MODE_BG_COLORS.invest
                : "transparent",
          }}
          value="invest"
        >
          Invest
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

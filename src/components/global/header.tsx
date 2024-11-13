"use client";

import { useEffect } from "react";

import { useLocalStorage } from "@/stores/localstorage";

export default function Header() {
  const local = useLocalStorage();
  const mode = local.mode.replace(/[^a-zA-Z ]/g, "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    local.setMode(mode as "date" | "network" | "invest");
  }, []);

  return (
    <>
      {/* Desktop view */}
      <div className="fixed left-0 top-0 ml-4 mt-2">
        <h1 className="font-sans text-[48px] font-extrabold tracking-[-0.05em] drop-shadow-[0_1.2px_2px_rgba(255,255,255,0.8)]">
          Stumble{" "}
          <span className="text-sm tracking-[-0.05em] drop-shadow-[0_1.2px_2px_var(--app-background)]">
            {mode}
          </span>
        </h1>
      </div>
    </>
  );
}

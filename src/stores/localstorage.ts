"use client";

import { create } from "zustand";

function getItemFromLocalStorage(key: string) {
  "use client";

  if (typeof window === "undefined") return;
  return localStorage.getItem(key);
}

function setItemToLocalStorage(key: string, value: string) {
  "use client";

  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}

function settingRootCssVariable(mode: "date" | "network" | "invest") {
  "use client";

  if (typeof window === "undefined") return;

  document.body.style.setProperty("--app-background", MODE_BG_COLORS[mode]);
}

export const MODE_BG_COLORS = {
  date: "#FFB730",
  network: "#bfddf7",
  invest: "#a0d9a2",
};

export const useLocalStorage = create<LocalStorage>()((set) => ({
  name: getItemFromLocalStorage("name") || undefined,
  walletAddress:
    (getItemFromLocalStorage("walletAddress") as `0x${string}`) || undefined,
  telegramId:
    (getItemFromLocalStorage("telegramId") as `@${string}`) || undefined,
  bio: getItemFromLocalStorage("bio") || undefined,
  picturesUrl: JSON.parse(getItemFromLocalStorage("picturesUrl") || "[]"),
  everyDataAvailabe: Boolean(
    getItemFromLocalStorage("name") &&
      getItemFromLocalStorage("walletAddress") &&
      getItemFromLocalStorage("telegramId") &&
      getItemFromLocalStorage("bio") &&
      getItemFromLocalStorage("picturesUrl")
  ),
  matches: JSON.parse(getItemFromLocalStorage("matches") || "{}"),
  mode: (() => {
    const gettingMode = getItemFromLocalStorage("mode") as
      | "date"
      | "network"
      | "invest"
      | undefined;
    if (!gettingMode) {
      setItemToLocalStorage("mode", "date");
      settingRootCssVariable("date");
      return "date";
    }
    settingRootCssVariable(gettingMode);
    return gettingMode;
  })(),
  setName: (name: string) => {
    setItemToLocalStorage("name", name);
    set({ name });
  },
  setWalletAddress: (walletAddress: `0x${string}`) => {
    setItemToLocalStorage("walletAddress", walletAddress);
    set({ walletAddress });
  },
  setTelegramId: (telegramId: `@${string}`) => {
    setItemToLocalStorage("telegramId", telegramId);
    set({ telegramId });
  },
  setBio: (bio: string) => {
    setItemToLocalStorage("bio", bio);
    set({ bio });
  },
  setPicturesUrl: (picturesUrl: string[]) => {
    setItemToLocalStorage("picturesUrl", JSON.stringify(picturesUrl));
    set({ picturesUrl });
  },
  setEveryDataAvailabe: (everyDataAvailabe: boolean) => {
    set({ everyDataAvailabe });
  },
  addMatch: (match: UserInfo) => {
    const matches = JSON.parse(getItemFromLocalStorage("matches") || "{}");
    matches[match.telegramId] = match;
    setItemToLocalStorage("matches", JSON.stringify(matches));
    set({ matches: JSON.parse(getItemFromLocalStorage("matches") || "{}") });
  },
  setMode: (mode: "date" | "network" | "invest") => {
    // setting the global rootcss variable
    settingRootCssVariable(mode);
    setItemToLocalStorage("mode", JSON.stringify(mode));
    set({ mode });
  },
}));

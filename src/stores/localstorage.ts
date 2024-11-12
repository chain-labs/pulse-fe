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

export const useLocalStorage = create<LocalStorage>()((set) => ({
  name: getItemFromLocalStorage("name") || undefined,
  walletAddress: (getItemFromLocalStorage("walletAddress") as `0x${string}`) || undefined,
  telegramId: (getItemFromLocalStorage("telegramId") as `@${string}`) || undefined,
  bio: getItemFromLocalStorage("bio") || undefined,
  picturesUrl: JSON.parse(getItemFromLocalStorage("picturesUrl") || "[]"),
  everyDataAvailabe: Boolean(
    getItemFromLocalStorage("name") &&
    getItemFromLocalStorage("walletAddress") &&
    getItemFromLocalStorage("telegramId") &&
    getItemFromLocalStorage("bio") &&
    getItemFromLocalStorage("picturesUrl")
  ),
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
}));

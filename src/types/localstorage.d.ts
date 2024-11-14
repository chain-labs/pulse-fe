type LocalStorage = Partial<UserInfo> & {
  everyDataAvailabe: boolean;
  matches: Record<string, UserInfo>;
  mode: "date" | "network" | "invest";
  totalTransactions: string;
  memecoinBalance: string;
  setName: (name: string) => void;
  setWalletAddress: (walletAddress: `0x${string}`) => void;
  setTelegramId: (telegramId: `@${string}`) => void;
  setBio: (bio: string) => void;
  setPicturesUrl: (picturesUrl: string[]) => void;
  setEveryDataAvailabe: (everyDataAvailabe: boolean) => void;
  addMatch: (match: UserInfo) => void;
  setMode: (mode: "date" | "network" | "invest") => void;
  setMemecoinBalance: (memeCoinBalance: string) => void;
  setTotalTransactions: (totalTransactions: string) => void;
};

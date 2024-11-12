type LocalStorage = Partial<UserInfo> & {
  everyDataAvailabe: boolean;
  setName: (name: string) => void;
  setWalletAddress: (walletAddress: `0x${string}`) => void;
  setTelegramId: (telegramId: `@${string}`) => void;
  setBio: (bio: string) => void;
  setPicturesUrl: (picturesUrl: string[]) => void;
  setEveryDataAvailabe: (everyDataAvailabe: boolean) => void;
};

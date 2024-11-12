"use client";

import { createContext, useContext, useState } from "react";

const useUserState = (initialUserCards: UserInfo[]) => useState<UserInfo[]>(initialUserCards);

const AppContext = createContext<ReturnType<typeof useUserState> | null>(null);

const AppProvider = ({
  userCards: initialUserCards,
  children,
}: {
  userCards: UserInfo[];
  children: React.ReactNode;
}) => {
  const [userCards, setUserCards] = useUserState(initialUserCards);

  return (
    <AppContext.Provider value={[userCards, setUserCards]}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useAppContext = () => {
  const user = useContext(AppContext);
  if (!user) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return user;
};

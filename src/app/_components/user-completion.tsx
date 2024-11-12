"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/stores/app-context";

import { getUserCards } from "../../../api/app.api";

const UserCompletion = () => {
  const [, setUserCards] = useAppContext();

  const handleReplay = async () => {
    setUserCards(await getUserCards().then((res) => res));
  };

  return (
    <div
      className={
        "flex h-full min-h-screen flex-col items-center justify-center overflow-hidden p-5"
      }
    >
      <div
        id="userUIWrapper"
        className="relative z-10 flex w-full flex-col items-center justify-center gap-6"
      >
        <div className="relative z-10 mb-[20px] aspect-[100/150] w-full max-w-xs">
          <div className="absolute flex aspect-[100/150] w-full select-none flex-col items-center justify-center rounded-lg bg-white p-2 shadow-card">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { ease: "backOut", duration: 0.2, delay: 0.15 },
              }}
              className="relative z-10 flex flex-col items-center justify-center text-center"
            >
              <h1 className="leading-tight">End of line</h1>
              <motion.div className="mt-8" whileTap={{ scale: 0.9 }}>
                <Button onClick={() => handleReplay()} className="font-medium">Get to next line</Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCompletion;

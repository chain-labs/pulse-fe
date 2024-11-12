"use client";

import { AnimatePresence, cubicBezier, motion } from "framer-motion";

import { useAppContext } from "@/stores/app-context";

import { UserCards } from "./_components";
import UserCompletion from "./_components/user-completion";

const User = () => {
  const [userCards] = useAppContext();

  const isCardStockEmpty = userCards.length === 0;
  const userScreenVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: { duration: 2, ease: cubicBezier(0.16, 1, 0.3, 1) },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: cubicBezier(0.7, 0, 0.84, 0) },
    },
  };

  return (
    <main className="bg-userSwipe-neutral mx-auto h-full min-h-screen ">
      <AnimatePresence mode="wait">
        {!isCardStockEmpty ? (
          <motion.div
            key="userScreen1"
            id="userScreen"
            variants={userScreenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <UserCards />
          </motion.div>
        ) : (
          <motion.div
            key="userScreen2"
            id="userCompletion"
            variants={userScreenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <UserCompletion />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default User;

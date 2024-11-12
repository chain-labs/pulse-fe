"use client";

import { AnimatePresence, cubicBezier, motion } from "framer-motion";
import { PiHeartDuotone, PiLink } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useLocalStorage } from "@/stores/localstorage";

import { UserCards } from "./_components";

const User = () => {
  const { matches } = useLocalStorage();

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
    <main className="bg-userSwipe-neutral mx-auto h-full min-h-screen">
      <AnimatePresence mode="wait">
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
      </AnimatePresence>
      <Drawer>
        {Object.keys(matches).length && (
          <DrawerTrigger className="fixed bottom-0 right-0 m-4">
            <Button className="aspect-square h-[50px] w-[50px] rounded-full bg-white">
              <PiHeartDuotone className="scale-[1.75] text-[#e40829]" />
            </Button>
          </DrawerTrigger>
        )}
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>MATCHES</DrawerTitle>
            <DrawerDescription>
              <hr className="my-2"/>
              {Object.keys(matches).map((telegramId: string) => (
                <div key={telegramId} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span>
                      <img
                        src={matches[telegramId].picturesUrl[0]}
                        alt={matches[telegramId].name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    </span>
                    <span>{matches[telegramId].name}</span> -
                    <span>
                      <a
                        href={`https://telegram.me/${telegramId.split("@")[1]}`}
                        target="_blank"
                        className="flex items-center justify-center text-blue-500"
                      >
                        {telegramId} <PiLink />
                      </a>
                    </span>
                  </div>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-nowrap">
                    {matches[telegramId].bio}
                  </span>
                  <hr />
                </div>
              ))}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </main>
  );
};

export default User;

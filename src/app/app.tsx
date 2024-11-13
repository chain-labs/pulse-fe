"use client";

import { AnimatePresence, cubicBezier, motion } from "framer-motion";
import {
  PiHeartDuotone,
  PiInfoDuotone,
  PiLink,
  PiUserCircleDuotone,
} from "react-icons/pi";

import Footer from "@/components/global/footer";
import Header from "@/components/global/header";
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
import ModeSelection from "./_components/mode-selection";
import SingleUserCard from "./_components/single-user-card";

const User = () => {
  const userData = useLocalStorage();
  const matches = userData?.matches ?? {};

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
      <Header />
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
      <Footer />
      {/* user matches */}
      <Drawer>
        {!!Object.keys(matches).length && (
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
              <hr className="my-2" />
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
                  <span className="text-start">{matches[telegramId].bio}</span>
                  <hr className="my-2" />
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
      {/* user profile and setting mode  */}
      <Drawer>
        {!!Object.keys(matches).length && (
          <DrawerTrigger className="fixed bottom-0 left-0 m-4">
            <Button className="aspect-square h-[50px] w-[50px] rounded-full bg-white">
              <PiUserCircleDuotone className="scale-[1.75] text-[#5cfda2]" />
            </Button>
          </DrawerTrigger>
        )}
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>PROFILE</DrawerTitle>
            <DrawerDescription className="mx-auto flex max-w-[300px] flex-wrap items-start justify-start gap-2 text-black">
              <div className="flex items-center justify-center gap-4">
                <h1 className="font-mono font-semibold">MODE: </h1>
                <ModeSelection />
              </div>
              <hr className="my-2" />
              <SingleUserCard data={userData as UserInfo} id="user" />
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {/* Information */}
      <Drawer>
        <DrawerTrigger className="fixed right-0 top-0 m-4">
          <Button className="aspect-square h-[50px] w-[50px] rounded-full bg-white">
            <PiInfoDuotone className="scale-[1.75] text-blue-500" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>INFORMATION</DrawerTitle>
            <DrawerDescription>
              <p>
                Welcome to Stumble, the go-to platform where Web3 enthusiasts
                gather, swipe, and match to form meaningful connections. Immerse
                yourself in a network designed for the digital pioneers and
                blockchain advocates who share your vision and humor. Whether
                you&apos;re here to exchange ideas, collaborate on projects, or
                simply revel in the latest trending memes, Stumble ensures you
                find your community and thrive within the shared culture of the
                Web3 movement
              </p>
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

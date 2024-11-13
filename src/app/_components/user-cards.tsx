"use client";

import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { PiLink } from "react-icons/pi";

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
import { easeOutExpo } from "@/lib/easings.data";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/stores/app-context";
import { useLocalStorage } from "@/stores/localstorage";
import { CardSwipeDirection, IsDragOffBoundary } from "@/types/app";

import UserActionBtn from "./user-action-btn";
import UserCard from "./user-card";
import UserCompletion from "./user-completion";

export const initialDrivenProps = {
  cardWrapperX: 0,
  buttonScaleBadAnswer: 1,
  buttonScaleGoodAnswer: 1,
};

const UserCards = () => {
  const [userCards, setUserCards] = useAppContext();
  const drawerRef = useRef<HTMLButtonElement>(null);
  const [recentMatch, setRecentMatch] = useState<UserInfo>();
  const [cardDrivenProps, setCardDrivenProps] = useState(initialDrivenProps);
  const [direction, setDirection] = useState<"left" | "right" | "">("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOffBoundary, setIsDragOffBoundary] =
    useState<IsDragOffBoundary>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  const localstorageUserInfo = useLocalStorage();

  useEffect(() => {
    const userInfo = localstorageUserInfo;
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "");
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          sessionId: localstorageUserInfo.mode,
          userInfo,
        })
      );
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "sessionUpdate") {
        const filteredProfiles = data.users.filter((profile: UserInfo) => {
          // remove matches
          return (
            !localstorageUserInfo.matches[profile.telegramId] &&
            profile.telegramId !== userInfo.telegramId
          );
        }); // Exclude your own profile
        setUserCards(filteredProfiles);
      }
      if (data.type === "match") {
        localstorageUserInfo.addMatch(data.handle);
        setRecentMatch(data.handle);
      }
    };
    ws.onclose = () => console.log("Disconnected from WebSocket");
    setSocket(ws);
    return () => ws.close();
  }, [localstorageUserInfo]);

  const swipeRight = async () => {
    const userInfo = localstorageUserInfo;
    if (socket && userCards.length > 0) {
      const currentProfile = userCards[currentProfileIndex];
      await socket.send(
        JSON.stringify({
          type: "swipe",
          sessionId: userInfo.mode,
          userInfo,
          swipeTarget: currentProfile.telegramId,
        })
      );
    }

    // nextProfile();
  };

  const swipeLeft = () => {
    nextProfile();
  };
  const nextProfile = () => {
    setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % userCards.length);
  };

  useEffect(() => {
    if (["left", "right"].includes(direction)) {
      if (direction === "right") {
        swipeRight().then(() => nextProfile());
      } else {
        swipeLeft();
      }
      setUserCards(
        userCards.slice(0, -1) // Remove the first card
      );
    }

    setDirection("");
  }, [direction]);

  const handleActionBtnOnClick = (btn: CardSwipeDirection) => {
    setDirection(btn);
  };

  const cardVariants = {
    current: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: easeOutExpo },
    },
    upcoming: {
      opacity: 0.75,
      y: 67,
      scale: 0.9,
      transition: { duration: 0.3, ease: easeOutExpo, delay: 0 },
    },
    remainings: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    exit: {
      opacity: [1, 0.8, 0.6, 0],
      filter: ["blur(0px)", "blur(2px)", "blur(5px)", "blur(10px)"],
      x: direction === "left" ? -300 : 300,
      y: 40,
      rotate: direction === "left" ? -20 : 20,
      transition: { duration: 0.5, ease: easeOutExpo },
    },
  };

  useEffect(() => {
    if (!drawerRef.current) return;
    if (recentMatch) {
      drawerRef.current.click();
    }
  }, [recentMatch]);

  return (
    <>
      <motion.div
        initial={{ backgroundColor: "none" }}
        animate={{
          backgroundColor:
            isDragOffBoundary === "left"
              ? "#eb5465"
              : isDragOffBoundary === "right"
                ? "#8cd14b"
                : "rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          `flex h-full min-h-screen flex-col items-center justify-center p-5 pt-[50px] ${
            isDragging ? "cursor-grabbing" : ""
          }`
        )}
      >
        <div
          id="userUIWrapper"
          className="relative z-10 flex w-full flex-col items-center justify-center gap-6"
        >
          <div
            id="cardsWrapper"
            className="relative z-10 aspect-[100/150] h-fit w-full max-w-xs"
          >
            <AnimatePresence mode="wait">
              {userCards.length === 0 ? (
                <UserCompletion />
              ) : (
                userCards.map((card, i) => {
                  const isLast = i === userCards.length - 1;
                  const isUpcoming = i === userCards.length - 2;
                  return (
                    <motion.div
                      key={`card-${i}`}
                      id={`card-${card.walletAddress}`}
                      className={"relative shadow-sm"}
                      variants={cardVariants}
                      initial="remainings"
                      animate={
                        isLast
                          ? "current"
                          : isUpcoming
                            ? "upcoming"
                            : "remainings"
                      }
                      exit="exit"
                    >
                      <UserCard
                        data={card}
                        id={card.walletAddress}
                        setCardDrivenProps={setCardDrivenProps}
                        isDragging={isDragging}
                        setIsDragging={setIsDragging}
                        setIsDragOffBoundary={setIsDragOffBoundary}
                        setDirection={setDirection}
                      />
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
          {userCards.length > 0 && (
            <div
              id="actions"
              className="relative z-10 flex w-full items-center justify-center gap-8"
            >
              <UserActionBtn
                direction="left"
                ariaLabel="swipe left"
                scale={cardDrivenProps.buttonScaleBadAnswer}
                isDragOffBoundary={isDragOffBoundary}
                onClick={() => handleActionBtnOnClick("left")}
              />
              <UserActionBtn
                direction="right"
                ariaLabel="swipe right"
                scale={cardDrivenProps.buttonScaleGoodAnswer}
                isDragOffBoundary={isDragOffBoundary}
                onClick={() => handleActionBtnOnClick("right")}
              />
            </div>
          )}
        </div>
      </motion.div>

      <Drawer
        onClose={() => {
          setRecentMatch(undefined);
        }}
      >
        <DrawerTrigger ref={drawerRef}></DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>MATCH FOUND</DrawerTitle>
            <DrawerDescription>
              You have matched with {recentMatch?.name}{" "}
              <a
                href={`https://telegram.me/${recentMatch?.telegramId.split("@")[1]}`}
                target="_blank"
                className="flex items-center justify-center gap-2 text-blue-500"
              >
                {recentMatch?.telegramId} <PiLink />
              </a>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>
              <Button
                variant="outline"
                onClick={() => {
                  setRecentMatch(undefined);
                }}
              >
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default UserCards;

"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { devepmentConfig } from "@/config/dev";
import { easeOutExpo } from "@/lib/easings.data";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/stores/app-context";
import { useLocalStorage } from "@/stores/localstorage";
import { CardSwipeDirection, IsDragOffBoundary } from "@/types/app";

import UserActionBtn from "./user-action-btn";
import UserCard from "./user-card";

export const initialDrivenProps = {
  cardWrapperX: 0,
  buttonScaleBadAnswer: 1,
  buttonScaleGoodAnswer: 1,
};

const UserCards = () => {
  const [userCards, setUserCards] = useAppContext();
  const [, setMatches] = useState<string[]>([]);
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
    const ws = new WebSocket(devepmentConfig.WEBSOCKET_URL);
    ws.onopen = () => {
      ws.send(
        JSON.stringify({ type: "join", sessionId: "global-session", userInfo })
      );
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "sessionUpdate") {
        const filteredProfiles = data.users.filter(
          (profile: UserInfo) => profile.telegramId !== userInfo.telegramId
        ); // Exclude your own profile
        setUserCards(filteredProfiles);
      }
      if (data.type === "match") setMatches((prev) => [...prev, data.handle]);
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
          sessionId: "global-session",
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
    setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % userCards.length); // Loop endlessly
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

  return (
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
        `flex h-full min-h-screen flex-col items-center p-5 pt-[50px] ${
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
          <AnimatePresence>
            {userCards.map((card, i) => {
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
                    isLast ? "current" : isUpcoming ? "upcoming" : "remainings"
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
            })}
          </AnimatePresence>
        </div>
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
      </div>
    </motion.div>
  );
};

export default UserCards;

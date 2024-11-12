"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { easeOutExpo } from "@/lib/easings.data";
import { CardSwipeDirection, IsDragOffBoundary } from "@/types/app";

import UserActionBtn from "./user-action-btn";
import UserCard from "./user-card";
import { useAppContext } from "@/stores/app-context";

export const initialDrivenProps = {
  cardWrapperX: 0,
  buttonScaleBadAnswer: 1,
  buttonScaleGoodAnswer: 1,
};

const UserCards = () => {
  const [userCards, setUserCards] = useAppContext();
  const [cardDrivenProps, setCardDrivenProps] = useState(initialDrivenProps);
  const [direction, setDirection] = useState<"left" | "right" | "">("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOffBoundary, setIsDragOffBoundary] =
    useState<IsDragOffBoundary>(null);

  useEffect(() => {
    if (["left", "right"].includes(direction)) {
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
      opacity: 0.5,
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
      className={`flex h-full min-h-screen flex-col items-center justify-center p-5 ${
        isDragging ? "cursor-grabbing" : ""
      }`}
    >
      <div
        id="userUIWrapper"
        className="relative z-10 flex w-full flex-col items-center justify-center gap-6"
      >
        <div
          id="cardsWrapper"
          className="relative z-10 mb-[50px] aspect-[100/150] w-full max-w-xs"
        >
          <AnimatePresence>
            {userCards.map((card, i) => {
              const isLast = i === userCards.length - 1;
              const isUpcoming = i === userCards.length - 2;
              return (
                <motion.div
                  key={`card-${i}`}
                  id={`card-${card.walletAddress}`}
                  className={"relative"}
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

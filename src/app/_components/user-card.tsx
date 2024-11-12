"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import Moralis from "moralis";
import { useMediaQuery } from "usehooks-ts";

import { useLocalStorage } from "@/stores/localstorage";
import { IsDragOffBoundary } from "@/types/app";

type Props = {
  id: string; // Assuming 'walletAddress' or unique identifier is a string
  data: UserInfo; // The data type based on your user structure
  setCardDrivenProps: Dispatch<
    SetStateAction<{
      cardWrapperX: number;
      buttonScaleBadAnswer: number;
      buttonScaleGoodAnswer: number;
    }>
  >;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  isDragging: boolean;
  setIsDragOffBoundary: Dispatch<SetStateAction<IsDragOffBoundary>>;
  setDirection: Dispatch<SetStateAction<"left" | "right" | "">>;
};

const UserCard = ({
  id,
  data,
  setCardDrivenProps,
  setIsDragging,
  isDragging,
  setIsDragOffBoundary,
  setDirection,
}: Props) => {
  const localstorageUserInfo = useLocalStorage();
  const x = useMotionValue(0);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const offsetBoundary = 150;

  // Motion transforms
  const inputX = [offsetBoundary * -1, 0, offsetBoundary];
  const outputX = [-200, 0, 200];
  const outputY = [50, 0, 50];
  const outputRotate = [-40, 0, 40];
  const outputActionScaleLeft = [3, 1, 0.3];
  const outputActionScaleRight = [0.3, 1, 3];

  const drivenX = useTransform(x, inputX, outputX);
  const drivenY = useTransform(x, inputX, outputY);
  const drivenRotation = useTransform(x, inputX, outputRotate);
  const drivenScaleLeft = useTransform(x, inputX, outputActionScaleLeft);
  const drivenScaleRight = useTransform(x, inputX, outputActionScaleRight);

  useMotionValueEvent(x, "change", (latest) => {
    //eslint-disable-next-line
    setCardDrivenProps((state: any) => ({
      ...state,
      cardWrapperX: latest,
      buttonScaleBadAnswer: drivenScaleLeft,
      buttonScaleGoodAnswer: drivenScaleRight,
    }));
  });

  const [selectedPictureIndex, setSelectedPictureIndex] = useState(0);

  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    async function getTransactions() {
      try {
        await Moralis.start({
          apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        });

        const response = await Moralis.EvmApi.wallets.getWalletStats({
          chain: "0x1",
          address: localStorage.getItem("walletAddress") ?? "",
        });

        console.log("response: ----", response.result.transactions.total);
        setTotalTransactions(Number(response.result.transactions.total));
      } catch (e) {
        console.error(e);
      }
    }
    getTransactions();
  }, [localstorageUserInfo]);

  return (
    <>
      <motion.div
        id={`cardContent-${id}`}
        className="absolute aspect-[100/150] w-full select-none rounded-lg bg-white p-4 shadow-card"
        style={{
          x: drivenX,
          y: drivenY,
          rotate: drivenRotation,
        }}
      >
        <motion.div
          className="relative mx-auto w-full gap-2"
          style={{
            display: "grid",
            gridTemplateAreas: `'main second third'`,
          }}
        >
          <AnimatePresence>
            {data.picturesUrl.map((url, idx) => (
              <motion.img
                // layoutId={`user-card-image-${idx}`}
                onClick={() => setSelectedPictureIndex(idx)}
                key={id + url + Math.random()}
                src={url}
                alt="User"
                width={100}
                height={100}
                style={{
                  gridArea:
                    idx === selectedPictureIndex
                      ? "main"
                      : (idx === 1 && selectedPictureIndex !== 2) || idx === 0
                        ? "second"
                        : "third",
                }}
                className={
                  "aspect-square h-auto w-auto cursor-pointer rounded-lg object-cover transition-opacity duration-500"
                }
              />
            ))}
          </AnimatePresence>
        </motion.div>
        <div className="flex w-full flex-col items-baseline justify-between">
          <h1 className="font-mono text-[32px] font-bold">{data.name}</h1>
          <p className="font-sans text-[16px]">{data.bio}</p>
          <p className="rounded-full px-6 py-1 text-[12px] font-bold font-sans bg-[#FFB730] mx-auto">Total Transactions Done: 5</p>
        </div>

        {/* Add relevant data fields */}
      </motion.div>
      <motion.div
        id={`cardDriverWrapper-${id}`}
        className={`absolute aspect-[100/150] w-full ${
          !isDragging ? "hover:cursor-grab" : ""
        }`}
        drag="x"
        dragSnapToOrigin
        dragElastic={isMobile ? 0.2 : 0.06}
        dragConstraints={{ left: 0, right: 0 }}
        dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
        onDragStart={() => setIsDragging(true)}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        onDrag={(_, info) => {
          const offset = info.offset.x;

          if (offset < 0 && offset < offsetBoundary * -1) {
            setIsDragOffBoundary("left");
          } else if (offset > 0 && offset > offsetBoundary) {
            setIsDragOffBoundary("right");
          } else {
            setIsDragOffBoundary(null);
          }
        }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        onDragEnd={(_, info) => {
          setIsDragging(false);
          setIsDragOffBoundary(null);
          const isOffBoundary =
            info.offset.x > offsetBoundary || info.offset.x < -offsetBoundary;
          const direction = info.offset.x > 0 ? "right" : "left";

          if (isOffBoundary) {
            setDirection(direction);
          }
        }}
        style={{ x }}
      ></motion.div>
    </>
  );
};

export default UserCard;

"use client";

import { motion } from "framer-motion";
import { PiThumbsDownDuotone } from "react-icons/pi";
import { PiThumbsUpDuotone } from "react-icons/pi";

import { cn } from "@/lib/utils";
import { IsDragOffBoundary } from "@/types/app";

const actionPropsMatrix = {
  left: {
    ariaLabel: "Swipe Left",
    bgColorClass: "bg-[#eb5465]",
    iconBaseColorClass: "text-[#701820]",
  },
  right: {
    ariaLabel: "Swipe Right",
    bgColorClass: "bg-[#8cd14b]",
    iconBaseColorClass: "text-[#2C5B10]",
  },
};

type Props = {
  ariaLabel: string;
  scale: number;
  direction: "left" | "right";
  isDragOffBoundary: IsDragOffBoundary;
  onClick: () => void;
};

const UserActionBtn = ({
  scale,
  direction,
  onClick,
  isDragOffBoundary = null,
}: Props) => {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.9 }}>
      <motion.div
        className={cn(
          `flex h-[60px] w-[60px] items-center justify-center rounded-full ${actionPropsMatrix[direction].bgColorClass} shadow-sm`
        )}
        style={{ scale: scale }}
      >
        {direction === "left" ? (
          <span
            className={cn(
              `${actionPropsMatrix[direction].iconBaseColorClass} text-[24px] transition-all duration-300 ${isDragOffBoundary === "right" ? "blur-[5px]" : ""}`
            )}
          >
            <PiThumbsDownDuotone />
          </span>
        ) : (
          <span
            className={cn(
              `${actionPropsMatrix[direction].iconBaseColorClass} text-[24px] transition-all duration-300 ${isDragOffBoundary === "left" ? "blur-[5px]" : ""}`
            )}
          >
            <PiThumbsUpDuotone />
          </span>
        )}
      </motion.div>
    </motion.button>
  );
};

export default UserActionBtn;

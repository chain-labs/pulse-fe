"use client";

import { motion } from "framer-motion";
import { PiArrowCounterClockwiseDuotone } from "react-icons/pi";

import { Button } from "@/components/ui/button";

import ModeSelection from "./mode-selection";

const UserCompletion = () => {
  return (
    <div className="relative z-10 mb-[20px] aspect-[100/150] w-full max-w-xs font-sans">
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
          <h1 className="leading-tight">
            Among the individuals in your network, consider refreshing the page
            or switching modes to optimize your experience.
          </h1>
          <motion.div
            className="mt-8 flex items-center justify-center gap-4"
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={() => {
                window.location.reload();
              }}
              className="bg-transparent font-medium text-black shadow-none hover:bg-transparent active:bg-transparent"
            >
              Refresh <PiArrowCounterClockwiseDuotone />
            </Button>{" "}
            {" / "}
            <ModeSelection />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserCompletion;

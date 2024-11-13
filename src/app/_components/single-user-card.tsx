"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import Moralis from "moralis";

import { useLocalStorage } from "@/stores/localstorage";

export default function SingleUserCard({
  data,
  id,
}: {
  data: UserInfo;
  id: string;
}) {
  const localstorageUserInfo = useLocalStorage();
  const [selectedPictureIndex, setSelectedPictureIndex] = useState(0);

  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    async function getTransactions() {
      try {
        await Moralis.start({
          apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        });

        const responseBase = await Moralis.EvmApi.wallets.getWalletStats({
          chain: "base",
          address: localStorage.getItem("walletAddress") ?? "",
        });

        const responseEth = await Moralis.EvmApi.wallets.getWalletStats({
          chain: "eth",
          address: localStorage.getItem("walletAddress") ?? "",
        });

        const responseOptimism = await Moralis.EvmApi.wallets.getWalletStats({
          chain: "optimism",
          address: localStorage.getItem("walletAddress") ?? "",
        });

        const responseArbitrum = await Moralis.EvmApi.wallets.getWalletStats({
          chain: "arbitrum",
          address: localStorage.getItem("walletAddress") ?? "",
        });

        setTotalTransactions(
          Number(responseBase.result.transactions.total) +
            Number(responseEth.result.transactions.total) +
            Number(responseOptimism.result.transactions.total) +
            Number(responseArbitrum.result.transactions.total)
        );
      } catch (e) {
        console.error(e);
      }
    }
    getTransactions();
  }, [localstorageUserInfo]);
  return (
    <>
      <motion.div className="relative mx-auto grid w-full grid-cols-2 items-center gap-2">
        {data.picturesUrl.map((url, idx) => (
          <motion.img
            //   layoutId={`user-card-image-${idx}`}
            onClick={() => setSelectedPictureIndex(idx)}
            key={id + url + Math.random()}
            src={url}
            alt="User"
            width={100}
            height={100}
            style={{
              gridColumn: data.picturesUrl.length === 1 ? "1/3" : "",
            }}
            className={
              "aspect-square h-auto max-h-[300px] w-auto cursor-pointer rounded-lg object-cover transition-opacity duration-500"
            }
          />
        ))}
      </motion.div>
      <div className="mt-auto flex h-fit w-full flex-col items-baseline justify-between gap-2">
        <h1 className="font-mono text-[32px] font-bold">{data.name}</h1>
        <p className="font-sans text-[16px]">{data.bio}</p>

        <p className="mx-auto rounded-full bg-[#FFB730] px-6 py-1 font-sans text-[12px] font-bold">
          Total Transactions Done: {totalTransactions}
        </p>
      </div>
    </>
  );
}

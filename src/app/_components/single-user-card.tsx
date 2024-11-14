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

  const [memecoinBalance, setMemecoinBalance] = useState(0);

  useEffect(() => {
    async function getTransactions() {
      try {
        await Moralis.start({
          apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        });

        const responseBase = Moralis.EvmApi.wallets.getWalletStats({
          chain: "0x2105",
          address: localStorage.getItem("walletAddress") ?? "",
        });

        const responseEth = Moralis.EvmApi.wallets.getWalletStats({
          chain: "0x1",
          address: localStorage.getItem("walletAddress") ?? "",
        });

        const responseOptimism = Moralis.EvmApi.wallets.getWalletStats({
          chain: "0xa",
          address: localStorage.getItem("walletAddress") ?? "",
        });

        const responseArbitrum = Moralis.EvmApi.wallets.getWalletStats({
          chain: "0xa4b1",
          address: localStorage.getItem("walletAddress") ?? "",
        });

        const responseMemecoin = Moralis.EvmApi.token.getWalletTokenBalances({
          tokenAddresses: ["0xb131f4A55907B10d1F0A50d8ab8FA09EC342cd74"],
          address: localStorage.getItem("walletAddress") ?? "",
        });

        setMemecoinBalance(
          Number((await responseMemecoin).result[0].amount) / Math.pow(10, 18)
        );

        setTotalTransactions(
          Number((await responseBase).result.transactions.total) +
            Number((await responseEth).result.transactions.total) +
            Number((await responseOptimism).result.transactions.total) +
            Number((await responseArbitrum).result.transactions.total)
        );
      } catch (error) {
        console.log("error", error);
      }
    }
    getTransactions();
  }, [localstorageUserInfo.walletAddress]);

  return (
    <>
      <motion.div className="relative mx-auto grid w-full grid-cols-2 items-center gap-2">
        {data.picturesUrl.map((url, idx) => (
          <motion.img
            //   layoutId={`user-card-image-${idx}`}
            onClick={() => setSelectedPictureIndex(idx)}
            key={id + url + idx}
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

        <p className="mx-auto flex flex-wrap items-center justify-center gap-[4px] rounded-full bg-[#FFB730] px-6 py-1 font-sans text-[12px] font-bold leading-[12px]">
          Total Transactions Done: <span>{totalTransactions}</span>
        </p>
        <p className="mx-auto flex flex-wrap items-center justify-center gap-[4px] rounded-full bg-[#a0d9a2] px-6 py-1 font-sans text-[12px] font-bold leading-[12px]">
          Memecoin balance: <span>{memecoinBalance}</span>
          {/* {Number(nativeBalance?.[0].amount ?? 0) / Math.pow(10, 18)} ETH */}
        </p>
      </div>
    </>
  );
}

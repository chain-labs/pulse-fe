"use client";

import { useLocalStorage } from "@/stores/localstorage";
import { motion } from "framer-motion";

export default function SingleUserCard({
  data,
  id,
}: {
  data: UserInfo;
  id: string;
}) {
  const localStorageUserInfo = useLocalStorage();
  return (
    <>
      <motion.div className="relative mx-auto grid w-full grid-cols-2 items-center gap-2">
        {data.picturesUrl.map((url, idx) => (
          <motion.img
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
          Total Transactions Done: <span>{localStorageUserInfo.totalTransactions ?? "0"}</span>
        </p>
        <p className="mx-auto flex flex-wrap items-center justify-center gap-[4px] rounded-full bg-[#a0d9a2] px-6 py-1 font-sans text-[12px] font-bold leading-[12px]">
          Memecoin balance: <span>{localStorageUserInfo.memecoinBalance ?? "0"}</span>
        </p>
      </div>
    </>
  );
}

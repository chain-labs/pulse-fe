"use client";

import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useLocalStorage } from "@/stores/localstorage";

import App from "./app";
import Signin from "./signin";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const localstorage = useLocalStorage();

  useEffect(() => {
    if (localstorage) {
      setLoading(false);
    }
  }, [localstorage]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-[700px]">
      {loading && (
        <div className="flex h-screen items-center justify-center ">
          <div className="aspect-[100/150] w-[300px] rounded-xl flex items-center justify-center bg-gradient-to-br from-black/10 to-black/0 shadow-2xl backdrop-blur-sm">
            <Skeleton className="bg-transparent">
              <h1 className="font-bold font-sans text-[24px] text-center">🚀LAUNCHING THE APP...🚀</h1>
            </Skeleton>
          </div>
        </div>
      )}
      {!loading && localstorage.everyDataAvailabe ? <App /> : <Signin />}
    </div>
  );
}

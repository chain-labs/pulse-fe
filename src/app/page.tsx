"use client";

import { useLocalStorage } from "@/stores/localstorage";

import App from "./app";
import Signin from "./signin";

export default function Home() {
  const { everyDataAvailabe } = useLocalStorage();
  return (
    <div className="mx-auto min-h-screen w-full max-w-[700px]">
      {everyDataAvailabe && false ? <App /> : <Signin />}
    </div>
  );
}

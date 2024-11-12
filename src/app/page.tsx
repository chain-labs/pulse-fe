"use client";

import App from "./app";
import Signin from "./signin";
import { useLocalStorage } from "@/stores/localstorage";

export default function Home() {
  const { everyDataAvailabe } = useLocalStorage();
  return (
    <div className="mx-auto min-h-screen w-full max-w-[700px] bg-teal-100">
      {everyDataAvailabe ? <App /> : <Signin />}
    </div>
  );
}

"use client";

import { useState } from "react";

import App from "./app";
import Signin from "./signin";

export default function Home() {
  const [userLoggedIn] = useState(true);
  return (
    <div className="mx-auto min-h-screen w-full max-w-[700px] bg-teal-100">
      {userLoggedIn ? <App /> : <Signin />}
    </div>
  );
}

"use client";

import Button from "@/lib/button";
import { useStore } from "@/stores/localstorage";

export default function Counter() {
  const { count, inc } = useStore();
  return <Button onClick={inc}>{count} - Counter (click me)</Button>;
}

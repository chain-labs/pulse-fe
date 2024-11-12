"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/stores/localstorage";

import UploadComponent from "./_components/upload";

type UploadResponse = {
  event: string;
  info: {
    id: string;
    batchId: string;
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    folder: string;
    access_mode: string;
    original_filename: string;
    path: string;
    thumbnail_url: string;
  };
};

const User = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  telegramId: z.string().regex(/^@[a-zA-Z0-9_]{5,}$/, "Invalid Telegram ID"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(150, "Bio must not exceed 150 characters"),
  isAdult: z.boolean().refine((val) => val === true, {
    message: "Mandatory to confirm you are at least 18 years old",
  }),
});

type UserInfo = z.infer<typeof User>;

export default function Signin() {
  const [uploadResponses, setUploadResponses] = useState<UploadResponse[]>([]);
  const [picturesError, setPicturesError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<UserInfo>({
    resolver: zodResolver(User),
  });

  const {
    setName,
    setWalletAddress,
    setTelegramId,
    setBio,
    setPicturesUrl,
    setEveryDataAvailabe,
  } = useLocalStorage((state) => state);

  const onSubmit = async (data: UserInfo) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/check-telegram-id/${data.telegramId}`
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.exists === false) {
            return;
          }
          setError("telegramId", {
            type: "manual",
            message: "Telegram ID already used",
          });
          throw new Error("Telegram ID already exists");
        });

      if (uploadResponses.length === 0) {
        setPicturesError("Please upload at least one picture");
        throw new Error("No pictures uploaded");
      }
      setName(data.name);
      setWalletAddress(data.walletAddress as `0x${string}`);
      setTelegramId(data.telegramId as `@${string}`);
      setBio(data.bio);
      setPicturesUrl(
        uploadResponses.map((response) => response.info.secure_url)
      );
      setEveryDataAvailabe(true);
      // Here you would typically send the data to your backend
      console.log("Form submitted:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-6 font-sans sm:py-12">
      <div className="relative mx-[16px] py-3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-mono text-[18px] font-bold">
              Welcome to {" "}
              <span className=" text-[36px] text-[#FFB730] font-sans font-bold tracking-[-0.05em] bg-black px-2 rounded-lg">{" "}Stumble</span>
            </CardTitle>
            <p>
              Create your account to get started. Your profile will be visible
              to other users.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input
                  id="walletAddress"
                  {...register("walletAddress")}
                  placeholder="0x..."
                />
                {errors.walletAddress && (
                  <p className="text-sm text-red-500">
                    {errors.walletAddress.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegramId">Telegram ID</Label>
                <Input
                  id="telegramId"
                  {...register("telegramId")}
                  placeholder="eg. @username"
                />
                {errors.telegramId && (
                  <p className="text-sm text-red-500">
                    {errors.telegramId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  placeholder="Tell us about yourself"
                />
                {errors.bio && (
                  <p className="text-sm text-red-500">{errors.bio.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pictures">Profile Pictures (1-3)</Label>
                <div className="flex w-full items-center justify-center">
                  <label
                    htmlFor="pictures"
                    className={cn(
                      `flex min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${picturesError ? "border-red-500" : "border-gray-300"} ${picturesError ? "bg-red-50" : "bg-gray-50"} hover:bg-gray-100`
                    )}
                  >
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                      <UploadComponent
                        uploadResponses={uploadResponses}
                        setUploadResponses={setUploadResponses}
                      />
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  </label>
                </div>
                {picturesError && (
                  <p className="text-sm text-red-500">{picturesError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="isAdult" className="flex items-center gap-2">
                  <Input
                    type="checkbox"
                    id="isAdult"
                    {...register("isAdult")}
                    className="mr-2 h-4 w-4"
                    required
                  />
                  *I confirm that I am at least 18 years old and I&apos;m using
                  this app with my own consent.
                </Label>
                {errors.isAdult && (
                  <p className="text-sm text-red-500">
                    {errors.isAdult.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
              <span className="text-[14px]">
                by submitting you agree to our{" "}
                <a
                  href="https://github.com/chain-labs/pulse-fe/blob/main/terms-conditions.md"
                  target="_blank"
                  className="text-blue-500"
                >
                  terms of service
                </a>{" "}
                and{" "}
                <a
                  href="https://github.com/chain-labs/pulse-fe/blob/main/privacy-policy.md"
                  target="_blank"
                  className="text-blue-500"
                >
                  privacy policy
                </a>
              </span>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/stores/localstorage";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const User = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  telegramId: z.string().regex(/^@[a-zA-Z0-9_]{5,}$/, "Invalid Telegram ID"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must not exceed 500 characters"),
  pictures: z
    .array(
      z.object({
        file: z
          .instanceof(File)
          .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
          ),
      })
    )
    .min(1, "Please upload at least 1 picture")
    .max(3, "You can upload a maximum of 3 pictures"),
});

type UserInfo = z.infer<typeof User>;

export default function Signin() {
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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
      setName(data.name);
      setWalletAddress(data.walletAddress as `0x${string}`);
      setTelegramId(data.telegramId as `@${string}`);
      setBio(data.bio);
      setPicturesUrl(
        data.pictures.map((picture) => URL.createObjectURL(picture.file))
      );
      setEveryDataAvailabe(true);
      // Here you would typically send the data to your backend
      console.log("Form submitted:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFileErrors([]);

    if (files.length > 3) {
      setFileErrors(["You can upload a maximum of 3 pictures"]);
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        setFileErrors((prev) => [
          ...prev,
          `${file.name} is too large. Max file size is 5MB.`,
        ]);
        return false;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setFileErrors((prev) => [
          ...prev,
          `${file.name} is not a supported file type.`,
        ]);
        return false;
      }
      return true;
    });

    setValue(
      "pictures",
      validFiles.map((file) => ({ file }))
    );
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-6 sm:py-12">
      <div className="relative py-3 mx-[16px]">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
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
                  placeholder="@username"
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
                    className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                      <Upload className="mb-4 h-8 w-8 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                    <Input
                      id="pictures"
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {errors.pictures && (
                  <p className="text-sm text-red-500">
                    {errors.pictures.message}
                  </p>
                )}
                {fileErrors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      <ul className="list-inside list-disc">
                        {fileErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

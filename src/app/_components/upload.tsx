"use client";

import axios from "axios";
import { sha1 } from "crypto-hash";
import { CldUploadButton } from "next-cloudinary";
import { CldImage } from "next-cloudinary";

import { Button } from "@/components/ui/button";

// {
//     "id": "uw-file3",
//     "batchId": "uw-batch2",
//     "asset_id": "c596902848fd4be275e39ade7a0f454b",
//     "public_id": "a9x6imxdmxkttjx5assj",
//     "version": 1693064739,
//     "version_id": "e442b0c273430ba6bfa20a1a9a1eebe7",
//     "signature": "8d0ca5461b1264ff838af756a3353c8f3163520a",
//     "width": 1224,
//     "height": 1632,
//     "format": "jpg",
//     "resource_type": "image",
//     "created_at": "2023-08-26T15:45:39Z",
//     "tags": [],
//     "bytes": 94009,
//     "type": "upload",
//     "etag": "bbd18943e82bcdd877cb308a8e11f9d1",
//     "placeholder": false,
//     "url": "http://res.cloudinary.com/dui2aldsv/image/upload/v1693064739/a9x6imxdmxkttjx5assj.jpg",
//     "secure_url": "https://res.cloudinary.com/dui2aldsv/image/upload/v1693064739/a9x6imxdmxkttjx5assj.jpg",
//     "folder": "",
//     "access_mode": "public",
//     "original_filename": "366346145_113993508441791_4552045723248126156_n",
//     "path": "v1693064739/a9x6imxdmxkttjx5assj.jpg",
//     "thumbnail_url": "https://res.cloudinary.com/dui2aldsv/image/upload/c_limit,h_60,w_90/v1693064739/a9x6imxdmxkttjx5assj.jpg"
// }

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

const MAX_UPLOAD_LIMIT = 3;

export default function UploadComponent({
  uploadResponses,
  setUploadResponses,
}: {
  uploadResponses: UploadResponse[];
  setUploadResponses: React.Dispatch<React.SetStateAction<UploadResponse[]>>;
}) {
  const beyondMaxLimit = uploadResponses.length >= MAX_UPLOAD_LIMIT;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = (results: any) => {
    const e: UploadResponse = {
      event: results.event,
      info: {
        id: results.info.id,
        batchId: results.info.batchId,
        asset_id: results.info.asset_id,
        public_id: results.info.public_id,
        version: results.info.version,
        version_id: results.info.version_id,
        signature: results.info.signature,
        width: results.info.width,
        height: results.info.height,
        format: results.info.format,
        resource_type: results.info.resource_type,
        created_at: results.info.created_at,
        tags: results.info.tags,
        bytes: results.info.bytes,
        type: results.info.type,
        etag: results.info.etag,
        placeholder: results.info.placeholder,
        url: results.info.url,
        secure_url: results.info.secure_url,
        folder: results.info.folder,
        access_mode: results.info.access_mode,
        original_filename: results.info.original_filename,
        path: results.info.path,
        thumbnail_url: results.info.thumbnail_url,
      },
    };
    console.log(e);
    setUploadResponses((prev) => [...prev, e]);
  };

  const handleDelete = async (public_id: string) => {
    const timestamp = new Date().getTime();
    const string = `public_id=${public_id}&timestamp=${timestamp}${process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET}`;
    console.log("string", string);
    const signature = await sha1(string);
    const formData = new FormData();
    formData.append("public_id", public_id);
    formData.append("signature", signature);
    formData.append("api_key", `${process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}`);
    formData.append("timestamp", `${timestamp}`);
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dkebnnglv/image/destroy",
      formData
    );
    if (res.status === 200) {
      console.log("deleted");
      setUploadResponses((prev) =>
        prev.filter(
          (uploadResponse) => uploadResponse.info.public_id !== public_id
        )
      );
    }
  };

  return (
    <div className="flex gap-2">
      {beyondMaxLimit === false && (
        <CldUploadButton
          uploadPreset="find-your-pulse"
          className="my-auto h-fit rounded bg-sky-500 px-4 py-2 font-bold text-white hover:bg-sky-700"
          onSuccess={handleUpload}
          options={{
            clientAllowedFormats: [
              "png",
              "gif",
              "jpeg",
              "jpg",
              "webp",
              "heic",
              "heif",
            ],
            sources: [
              "local",
              "camera",
              "google_drive",
              "instagram",
              "facebook",
            ],
            maxFiles: MAX_UPLOAD_LIMIT - uploadResponses.length,
          }}
        />
      )}
      <div className="my-4 flex gap-3">
        {uploadResponses?.map((uploadResponse) => (
          <div
            key={uploadResponse.info.id}
            className="flex flex-col items-center justify-center gap-2"
          >
            <CldImage
              height={uploadResponse.info.height}
              width={uploadResponse.info.width}
              src={uploadResponse.info.public_id}
              sizes="100vw"
              alt="Description of my image"
              className="w-20"
            />
            <Button
              onClick={() => handleDelete(uploadResponse.info.public_id)}
              variant={"destructive"}
              className="w-full"
            >
              Delete ⬆️
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

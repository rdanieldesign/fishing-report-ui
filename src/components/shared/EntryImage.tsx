import { Loader2, AlertCircle } from "lucide-react";

export type ImageStatus = "uploading" | "failed" | "complete";

interface EntryImageProps {
  imageURL: string | null;
  status: ImageStatus;
}

export function EntryImage({ imageURL, status }: EntryImageProps) {
  const base = "w-40 h-40 rounded border border-gray-200";

  const getErrorTemplate = (message: string) => (
    <div
      className={`${base} bg-red-50 flex flex-col items-center justify-center gap-1`}
    >
      <AlertCircle className="w-6 h-6 text-red-400" aria-hidden="true" />
      <span className="text-xs text-danger">{message}</span>
    </div>
  );

  if (status === "complete" && imageURL) {
    return (
      <img src={imageURL} alt="Entry" className={`${base} object-cover`} />
    );
  }

  if (status === "uploading") {
    return (
      <div className={`${base} bg-gray-100 flex items-center justify-center`}>
        <Loader2
          className="w-6 h-6 text-gray-400 animate-spin"
          aria-label="Uploading image"
        />
      </div>
    );
  }

  if (status === "failed") {
    return getErrorTemplate("Upload failed");
  }

  return getErrorTemplate("Could not load image");
}

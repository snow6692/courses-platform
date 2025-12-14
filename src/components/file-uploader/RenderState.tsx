import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { FileText } from "lucide-react";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-muted border-muted-foreground mb-4 flex size-12 items-center justify-center rounded-full border border-dashed">
        <CloudUploadIcon
          className={cn(
            "text-muted-foreground size-6",
            isDragActive && "text-primary",
          )}
        />
      </div>
      <p className="text-muted-foreground text-base font-semibold">
        Drop you files here or{" "}
        <span className="text-primary cursor-pointer underline text-shadow-black">
          click to upload
        </span>
      </p>
      <Button className="mt-4" type="button">
        Select File
      </Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-destructive/30 mb-4 flex size-12 items-center justify-center rounded-full">
        <ImageIcon className={cn("text-destructive size-6")} />
      </div>
      <p className="text-base font-semibold">Upload Failed</p>
      <p className="text-muted-foreground text-xs">
        Please try again with a different file
      </p>
      <Button
        type="button"
        variant={"outline"}
        className="text-muted-foreground mt-3 text-xl font-semibold"
      >
        Click or drag and drop to try again
      </Button>
    </div>
  );
}

export function RenderUploadedState({
  previewUrl,
  onRemoveFile,
  isDeleting,
  fileType,
}: {
  previewUrl: string;
  onRemoveFile: () => void;
  isDeleting: boolean;
  fileType: "video" | "image" | "pdf";
}) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {fileType === "video" ? (
        <video
          src={previewUrl}
          controls
          className="max-h-full w-full object-contain"
        />
      ) : fileType === "pdf" ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3">
          <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
            <FileText className="text-primary size-8" />
          </div>
          <p className="text-foreground text-sm font-medium">
            PDF Uploaded Successfully
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              window.open(previewUrl, "_blank");
            }}
          >
            Open PDF in New Tab
          </Button>
        </div>
      ) : (
        <Image
          src={previewUrl}
          alt="uploaded file"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          className="object-contain p-2"
        />
      )}

      <Button
        type="button"
        disabled={isDeleting}
        onClick={(e) => {
          e.stopPropagation();
          onRemoveFile();
        }}
        className="absolute top-2 right-2 z-10"
        variant={"destructive"}
        size={"icon"}
      >
        {isDeleting ? <Loader2 className="animate-spin" /> : <TrashIcon />}
      </Button>
    </div>
  );
}

export function RenderUploadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <p className="text-foreground text-sm font-medium">{progress}%</p>
      <p className="text-foreground mt-2 text-sm font-medium">Uploading...</p>
      <p className="text-muted-foreground mt-1 max-w-xs truncate text-xs">
        {file.name}
      </p>
    </div>
  );
}

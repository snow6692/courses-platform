import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";

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

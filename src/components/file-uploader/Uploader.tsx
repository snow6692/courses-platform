"use client";

import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState } from "./RenderState";
import { toast } from "sonner";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string; //local url
  fileType: "image" | "video";
}
function Uploader() {
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: "image",
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileState({
        file,
        uploading: false,
        progress: 0,
        error: false,
        objectUrl: URL.createObjectURL(file), //Convert the object{file size, type, name} to a url
        id: uuidv4(),
        isDeleting: false,
        fileType: "image",
      });
    }
  }, []);

  const uploadFile = (file: File) => {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      
    } catch (error) {
      
    }
  };

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files",
      );
      if (tooManyFiles) {
        toast.error("You can only upload one file");
        return;
      }

      const fileSize = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large",
      );
      if (fileSize) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const fileType = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-invalid-type",
      );
      if (fileType) {
        toast.error("File type must be an image");
        return;
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    multiple: false,
    maxSize: 1024 * 1024 * 5, // 5MB
    onDropRejected: (files: FileRejection[]) => rejectedFiles(files),
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative h-64 w-full border-2 border-dashed transition-colors duration-200 ease-in-out",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary",
      )}
    >
      <CardContent className="flex h-full w-full flex-col items-center justify-center p-4">
        <input {...getInputProps()} />
        <RenderEmptyState isDragActive={isDragActive} />
      </CardContent>
    </Card>
  );
}

export default Uploader;

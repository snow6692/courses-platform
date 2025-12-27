"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState";
import { toast } from "sonner";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  path?: string; // Bunny Storage path for deletion
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string; // CDN URL or local URL
  fileType: "image" | "video" | "pdf";
}

interface IProps {
  value?: string; // This is now the full CDN URL
  onChange?: (value: string) => void;
  fileTypeAccepted: "image" | "video" | "pdf";
}

function Uploader({ value, onChange, fileTypeAccepted }: IProps) {
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: fileTypeAccepted,
    path: value ? extractPathFromUrl(value) : undefined,
    objectUrl: value || undefined,
  });

  // Extract path from CDN URL for deletion
  function extractPathFromUrl(url: string): string | undefined {
    if (!url) return undefined;
    try {
      const urlObj = new URL(url);
      // Remove leading slash
      return urlObj.pathname.substring(1);
    } catch {
      return undefined;
    }
  }

  // Upload the file to Bunny Storage via XHR
  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
      }));

      try {
        // Get upload URL from server
        const presignedResponse = await fetch("/api/s3/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            fileSize: file.size,
            isImage: fileTypeAccepted === "image",
          }),
        });

        if (!presignedResponse.ok) {
          const error = await presignedResponse.json();
          toast.error(error.error || "Failed to get upload URL");
          setFileState((prev) => ({
            ...prev,
            uploading: false,
            progress: 0,
            error: true,
          }));
          return;
        }

        const { presignedUrl, key, accessKey, cdnUrl } =
          await presignedResponse.json();

        // Upload using XHR to track progress
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhrRef.current = xhr;

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentageCompleted = Math.round(
                (event.loaded / event.total) * 100,
              );
              setFileState((prev) => ({
                ...prev,
                progress: percentageCompleted,
              }));
            }
          };

          xhr.onload = () => {
            xhrRef.current = null;
            if (xhr.status === 200 || xhr.status === 201) {
              setFileState((prev) => ({
                ...prev,
                uploading: false,
                progress: 100,
                path: key,
                objectUrl: cdnUrl,
              }));
              onChange?.(cdnUrl); // Store the full CDN URL
              toast.success("File uploaded successfully");
              resolve();
            } else {
              reject(new Error("Failed to upload file"));
            }
          };

          xhr.onerror = () => {
            xhrRef.current = null;
            reject(new Error("Upload failed"));
          };

          xhr.onabort = () => {
            xhrRef.current = null;
            resolve();
          };

          xhr.open("PUT", presignedUrl);
          xhr.setRequestHeader("AccessKey", accessKey);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      } catch (error) {
        toast.error("Failed to upload file");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
      }
    },
    [fileTypeAccepted, onChange],
  );

  // onDrop is a callback function that is called when a file is dropped
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Revoke old object URL to avoid memory leak
        if (
          fileState.objectUrl &&
          (fileState.objectUrl.startsWith("blob:") ||
            !fileState.objectUrl.startsWith("http"))
        ) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        setFileState({
          file,
          uploading: false,
          progress: 0,
          error: false,
          objectUrl: URL.createObjectURL(file),
          id: uuidv4(),
          isDeleting: false,
          fileType: fileTypeAccepted,
        });
        uploadFile(file);
      }
    },
    [fileState.objectUrl, fileTypeAccepted, uploadFile],
  );

  // Cancel upload function
  const cancelUpload = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }

    // Cleanup object URL
    if (
      fileState.objectUrl &&
      (fileState.objectUrl.startsWith("blob:") ||
        !fileState.objectUrl.startsWith("http"))
    ) {
      URL.revokeObjectURL(fileState.objectUrl);
    }

    // Reset state
    setFileState({
      id: null,
      file: null,
      uploading: false,
      progress: 0,
      isDeleting: false,
      error: false,
      fileType: fileTypeAccepted,
      path: undefined,
      objectUrl: undefined,
    });

    toast.info("Upload cancelled");
  }, [fileState.objectUrl, fileTypeAccepted]);

  // Cleanup old object URL on unmount
  useEffect(() => {
    return () => {
      if (
        fileState.objectUrl &&
        (fileState.objectUrl.startsWith("blob:") ||
          !fileState.objectUrl.startsWith("http"))
      ) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  // Sync value prop with fileState when value changes
  useEffect(() => {
    if (value && value !== fileState.objectUrl) {
      setFileState((prev) => ({
        ...prev,
        path: extractPathFromUrl(value),
        objectUrl: value,
      }));
    }
  }, [value]);

  // Delete the file from Bunny Storage
  const handleRemoveFile = async () => {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      // Get path for deletion
      const pathToDelete =
        fileState.path || extractPathFromUrl(fileState.objectUrl);

      if (pathToDelete) {
        const response = await fetch(
          `/api/bunny/storage/delete?path=${encodeURIComponent(pathToDelete)}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          const error = await response.json();
          toast.error(error.error || "Failed to delete file");
          setFileState((prev) => ({
            ...prev,
            isDeleting: false,
            error: true,
          }));
          return;
        }
      }

      // Cleanup local object URL
      if (
        fileState.objectUrl &&
        (fileState.objectUrl.startsWith("blob:") ||
          !fileState.objectUrl.startsWith("http"))
      ) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.("");

      setFileState(() => ({
        file: null,
        uploading: false,
        progress: 0,
        error: false,
        objectUrl: undefined,
        id: null,
        isDeleting: false,
        fileType: fileTypeAccepted,
        path: undefined,
      }));

      toast.success("File deleted successfully");
    } catch (error) {
      toast.error("Failed to delete file");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  };

  // Handle rejected files
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
        const limit =
          fileTypeAccepted === "image"
            ? "5MB"
            : fileTypeAccepted === "pdf"
              ? "50MB"
              : "5GB";
        toast.error(`File size must be less than ${limit}`);
        return;
      }

      const fileType = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-invalid-type",
      );
      if (fileType) {
        const typeName =
          fileTypeAccepted === "image"
            ? "image"
            : fileTypeAccepted === "pdf"
              ? "PDF"
              : "video";
        toast.error(`File must be a ${typeName}`);
        return;
      }
    }
  }

  // Render content based on state
  function renderContent() {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file!}
          onCancel={cancelUpload}
        />
      );
    }
    if (fileState.error) {
      return <RenderErrorState />;
    }

    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl}
          onRemoveFile={handleRemoveFile}
          isDeleting={fileState.isDeleting}
          fileType={fileTypeAccepted}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      fileTypeAccepted === "video"
        ? { "video/*": [] }
        : fileTypeAccepted === "pdf"
          ? { "application/pdf": [] }
          : { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize:
      fileTypeAccepted === "image"
        ? 1024 * 1024 * 5 // image 5mb
        : fileTypeAccepted === "pdf"
          ? 1024 * 1024 * 50 // pdf 50mb
          : 1024 * 1024 * 5000, // video 5gb
    onDropRejected: (files: FileRejection[]) => rejectedFiles(files),
    disabled: fileState.uploading || !!fileState.objectUrl,
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
        {renderContent()}
      </CardContent>
    </Card>
  );
}

export default Uploader;

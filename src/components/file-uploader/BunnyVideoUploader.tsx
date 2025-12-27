"use client";

import React, { useState, useCallback, useRef } from "react";
import * as tus from "tus-js-client";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Upload,
  CheckCircle2,
  Loader2,
  X,
  Video,
  AlertCircle,
  Play,
  StopCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

interface BunnyUploadState {
  videoId: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  status: "idle" | "creating" | "uploading" | "encoding" | "ready" | "error";
  encodeProgress: number;
  error: string | null;
  embedUrl: string | null;
}

interface BunnyVideoUploaderProps {
  value?: string; // bunnyVideoId
  onChange?: (value: string) => void;
  onDelete?: (videoId: string) => void;
}

export default function BunnyVideoUploader({
  value,
  onChange,
  onDelete,
}: BunnyVideoUploaderProps) {
  const [state, setState] = useState<BunnyUploadState>({
    videoId: value || null,
    file: null,
    uploading: false,
    progress: 0,
    status: value ? "ready" : "idle",
    encodeProgress: 0,
    error: null,
    embedUrl: null,
  });

  const [isDragActive, setIsDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const uploadRef = useRef<tus.Upload | null>(null);

  // Fetch embed URL for preview
  const fetchEmbedUrl = useCallback(async (videoId: string) => {
    try {
      const res = await fetch(`/api/bunny/embed?videoId=${videoId}`);
      if (res.ok) {
        const data = await res.json();
        setState((prev) => ({ ...prev, embedUrl: data.embedUrl }));
      }
    } catch {
      console.error("Failed to fetch embed URL");
    }
  }, []);

  // Poll for encoding status
  const pollEncodingStatus = useCallback(
    async (videoId: string) => {
      const checkStatus = async () => {
        try {
          const res = await fetch(`/api/bunny/status?videoId=${videoId}`);
          const data = await res.json();

          if (data.status === "finished") {
            setState((prev) => ({
              ...prev,
              status: "ready",
              encodeProgress: 100,
            }));
            onChange?.(videoId);
            // Fetch embed URL for preview
            fetchEmbedUrl(videoId);
            return true;
          } else if (
            data.status === "error" ||
            data.status === "upload_failed"
          ) {
            setState((prev) => ({
              ...prev,
              status: "error",
              error: "Video encoding failed",
            }));
            return true;
          } else {
            setState((prev) => ({
              ...prev,
              encodeProgress: data.encodeProgress || 0,
            }));
            return false;
          }
        } catch {
          return false;
        }
      };

      // Poll every 3 seconds until done
      const poll = async () => {
        const done = await checkStatus();
        if (!done) {
          setTimeout(poll, 3000);
        }
      };

      poll();
    },
    [onChange, fetchEmbedUrl],
  );

  const handleUpload = useCallback(
    async (file: File) => {
      setState((prev) => ({
        ...prev,
        file,
        status: "creating",
        uploading: true,
        progress: 0,
        error: null,
        embedUrl: null,
      }));

      try {
        // Step 1: Create video in Bunny
        const createRes = await fetch("/api/bunny/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: file.name }),
        });

        if (!createRes.ok) {
          throw new Error("Failed to create video");
        }

        const { videoId, tusUploadUrl, tusHeaders } = await createRes.json();

        setState((prev) => ({
          ...prev,
          videoId,
          status: "uploading",
        }));

        // Step 2: Upload using TUS
        const upload = new tus.Upload(file, {
          endpoint: tusUploadUrl,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          headers: {
            AuthorizationSignature: tusHeaders.AuthorizationSignature,
            AuthorizationExpire: tusHeaders.AuthorizationExpire,
            VideoId: tusHeaders.VideoId,
            LibraryId: tusHeaders.LibraryId,
          },
          metadata: {
            filename: file.name,
            filetype: file.type,
          },
          onError: (error) => {
            console.error("Upload error:", error);
            setState((prev) => ({
              ...prev,
              status: "error",
              uploading: false,
              error: "Upload failed. Please try again.",
            }));
            uploadRef.current = null;
            toast.error("Upload failed");
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
            setState((prev) => ({
              ...prev,
              progress: percentage,
            }));
          },
          onSuccess: () => {
            setState((prev) => ({
              ...prev,
              uploading: false,
              status: "encoding",
              progress: 100,
            }));
            uploadRef.current = null;
            toast.success("Upload complete! Video is being processed...");
            // Start polling for encoding status
            pollEncodingStatus(videoId);
          },
        });

        // Store upload reference for cancellation
        uploadRef.current = upload;

        // Check for previous uploads
        upload.findPreviousUploads().then((previousUploads) => {
          if (previousUploads.length) {
            upload.resumeFromPreviousUpload(previousUploads[0]);
          }
          upload.start();
        });
      } catch (error) {
        console.error("Upload error:", error);
        setState((prev) => ({
          ...prev,
          status: "error",
          uploading: false,
          error: "Failed to upload video",
        }));
        uploadRef.current = null;
        toast.error("Failed to upload video");
      }
    },
    [pollEncodingStatus],
  );

  const handleCancel = useCallback(async () => {
    // Abort the TUS upload
    if (uploadRef.current) {
      uploadRef.current.abort();
      uploadRef.current = null;
    }

    // Delete the video from Bunny if it was created
    if (state.videoId) {
      try {
        await fetch(`/api/bunny/delete?videoId=${state.videoId}`, {
          method: "DELETE",
        });
      } catch {
        // Ignore delete errors during cancel
      }
    }

    setState({
      videoId: null,
      file: null,
      uploading: false,
      progress: 0,
      status: "idle",
      encodeProgress: 0,
      error: null,
      embedUrl: null,
    });

    toast.info("Upload cancelled");
  }, [state.videoId]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!file.type.startsWith("video/")) {
          toast.error("Please select a video file");
          return;
        }
        handleUpload(file);
      }
    },
    [handleUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        if (!file.type.startsWith("video/")) {
          toast.error("Please select a video file");
          return;
        }
        handleUpload(file);
      }
    },
    [handleUpload],
  );

  const handleDelete = useCallback(async () => {
    if (!state.videoId) return;

    try {
      await fetch(`/api/bunny/delete?videoId=${state.videoId}`, {
        method: "DELETE",
      });

      onDelete?.(state.videoId);
      onChange?.("");

      setState({
        videoId: null,
        file: null,
        uploading: false,
        progress: 0,
        status: "idle",
        encodeProgress: 0,
        error: null,
        embedUrl: null,
      });

      setShowPreview(false);
      toast.success("Video deleted");
    } catch {
      toast.error("Failed to delete video");
    }
  }, [state.videoId, onDelete, onChange]);

  // Load embed URL when component mounts with an existing value
  React.useEffect(() => {
    if (value && state.status === "ready" && !state.embedUrl) {
      fetchEmbedUrl(value);
    }
  }, [value, state.status, state.embedUrl, fetchEmbedUrl]);

  const renderContent = () => {
    switch (state.status) {
      case "idle":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <Upload className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground mb-2 text-sm">
              Drag and drop a video file, or click to browse
            </p>
            <p className="text-muted-foreground text-xs">
              Supports MP4, MOV, WebM, AVI
            </p>
          </div>
        );

      case "creating":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="text-primary mb-4 h-12 w-12 animate-spin" />
            <p className="text-sm">Creating video...</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
            >
              <StopCircle className="mr-1 h-4 w-4" /> Cancel
            </Button>
          </div>
        );

      case "uploading":
        return (
          <div className="flex w-full flex-col items-center justify-center px-8 py-8">
            <Video className="text-primary mb-4 h-12 w-12" />
            <p className="mb-2 text-sm">Uploading {state.file?.name}</p>
            <Progress value={state.progress} className="mb-2 h-2 w-full" />
            <p className="text-muted-foreground mb-4 text-xs">
              {state.progress}%
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
            >
              <StopCircle className="mr-1 h-4 w-4" /> Cancel Upload
            </Button>
          </div>
        );

      case "encoding":
        return (
          <div className="flex w-full flex-col items-center justify-center px-8 py-8">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-orange-500" />
            <p className="mb-2 text-sm">Processing video...</p>
            <Progress
              value={state.encodeProgress}
              className="mb-2 h-2 w-full"
            />
            <p className="text-muted-foreground text-xs">
              Encoding: {state.encodeProgress}%
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              Please wait, this may take a few minutes
            </p>
          </div>
        );

      case "ready":
        if (showPreview && state.embedUrl) {
          return (
            <div className="w-full">
              <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-black">
                <iframe
                  src={state.embedUrl}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full border-none"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPreview(false);
                  }}
                >
                  Hide Preview
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  <X className="mr-1 h-4 w-4" /> Remove
                </Button>
              </div>
            </div>
          );
        }

        return (
          <div className="relative flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="mb-4 h-12 w-12 text-green-500" />
            <p className="mb-2 text-sm text-green-600">Video ready!</p>
            <p className="text-muted-foreground mb-4 text-xs">
              Video ID: {state.videoId || value}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!state.embedUrl && (state.videoId || value)) {
                    fetchEmbedUrl(state.videoId || value!);
                  }
                  setShowPreview(true);
                }}
              >
                <Play className="mr-1 h-4 w-4" /> Preview
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <X className="mr-1 h-4 w-4" /> Remove
              </Button>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="text-destructive mb-4 h-12 w-12" />
            <p className="text-destructive mb-2 text-sm">{state.error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  status: "idle",
                  error: null,
                  videoId: null,
                }))
              }
            >
              Try again
            </Button>
          </div>
        );
    }
  };

  return (
    <Card
      className={cn(
        "cursor-pointer border-2 border-dashed transition-colors",
        isDragActive && "border-primary bg-primary/5",
        state.status === "error" && "border-destructive",
        state.status === "ready" && "border-green-500",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
      onClick={() => {
        if (state.status === "idle") {
          document.getElementById("bunny-video-input")?.click();
        }
      }}
    >
      <CardContent className="p-6">
        <input
          id="bunny-video-input"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={state.uploading}
        />
        {renderContent()}
      </CardContent>
    </Card>
  );
}

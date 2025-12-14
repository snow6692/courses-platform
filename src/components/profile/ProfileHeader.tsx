"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Loader2 } from "lucide-react";
import { useLanguage } from "@/providers/LanguageContext";
import { useRef, useState, useTransition } from "react";
import { updateProfileImage } from "@/app/actions/user.actions";
import { toast } from "sonner";

interface ProfileHeaderProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  metrics: {
    courses: number;
    hours: number;
  };
}

export function ProfileHeader({ user, metrics }: ProfileHeaderProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to S3
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/s3/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const imageKey = data.key;

      // Update user profile with new image
      startTransition(async () => {
        try {
          await updateProfileImage(imageKey);
          toast.success(t("profile.personal.save_success"));
        } catch (error: any) {
          toast.error(error.message || "Failed to update image");
          setPreviewImage(null);
        }
      });
    } catch (error) {
      toast.error("Failed to upload image");
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const displayImage = previewImage || user.image || "";

  return (
    <div className="relative mb-6 w-full overflow-hidden rounded-lg border bg-white p-6">
      {/* Background Decorative Pattern */}
      <div className="bg-primary absolute top-0 left-0 h-2 w-full"></div>

      <div
        className="relative z-10 flex flex-col items-center justify-end gap-6 md:flex-row"
        dir="rtl"
      >
        {/* User Info */}
        <div className="flex flex-1 flex-col items-center text-center md:items-end md:text-right">
          <h1 className="mb-1 text-2xl font-bold">{user.name}</h1>
          <p className="mb-4 text-gray-500">{user.email}</p>

          <div className="flex flex-wrap justify-center gap-2 md:justify-end">
            <Badge
              variant="secondary"
              className="bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200"
            >
              {t("profile.header.active_student")}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200"
            >
              {metrics.courses} {t("profile.header.courses")}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200"
            >
              {metrics.hours} {t("profile.header.learning_hours")}
            </Badge>
          </div>
        </div>

        {/* Avatar with Upload */}
        <div className="relative">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-sm md:h-32 md:w-32">
            <Avatar className="h-full w-full">
              <AvatarImage src={displayImage} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleImageClick}
            disabled={isUploading || isPending}
            className="absolute right-1 bottom-1 rounded-full border bg-white p-2 text-gray-600 shadow-md transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {isUploading || isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Camera size={16} />
            )}
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Loader2 } from "lucide-react";
import { useLanguage } from "@/providers/LanguageContext";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { env } from "@/lib/config";

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
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(
    user.image || null,
  );
  const router = useRouter();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(
        language === "ar"
          ? "الرجاء اختيار ملف صورة"
          : "Please select an image file",
      );
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        language === "ar"
          ? "حجم الصورة يجب أن يكون أقل من 5 ميجابايت"
          : "Image size must be less than 5MB",
      );
      return;
    }

    // Show preview immediately (better UX)
    const previewUrl = URL.createObjectURL(file);
    setCurrentImage(previewUrl);
    setIsUploading(true);

    try {
      // Step 1: Get presigned URL from our API
      const presignedResponse = await fetch("/api/profile/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      });

      if (!presignedResponse.ok) {
        const errorData = await presignedResponse.json();
        throw new Error(errorData.error || "Failed to get upload URL");
      }

      const { presignedUrl, key } = await presignedResponse.json();

      // Step 2: Upload file directly to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload to S3");
      }

      // Step 3: Construct the full image URL using Tigris storage format
      const imageUrl = `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev/${key}`;

      // Step 4: Update database via our API
      const updateResponse = await fetch("/api/profile/update-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      // Update state with actual S3 URL
      setCurrentImage(imageUrl);

      toast.success(
        language === "ar"
          ? "تم تحديث الصورة بنجاح"
          : "Image updated successfully",
      );

      // Soft refresh to update Navbar without full page reload
      router.refresh();
    } catch (error: any) {
      console.error("Upload error:", error);
      // Revert to original image on error
      setCurrentImage(user.image || null);
      toast.error(
        language === "ar" ? "فشل في رفع الصورة" : "Failed to upload image",
      );
    } finally {
      setIsUploading(false);
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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
              <AvatarImage src={currentImage || ""} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleImageClick}
            disabled={isUploading}
            className="absolute right-1 bottom-1 rounded-full border bg-white p-2 text-gray-600 shadow-md transition-colors hover:bg-gray-50 disabled:opacity-50"
            title={
              language === "ar"
                ? "تغيير الصورة الشخصية"
                : "Change profile photo"
            }
          >
            {isUploading ? (
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

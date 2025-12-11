import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";

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

export function  ProfileHeader({ user, metrics }: ProfileHeaderProps) {
  return (
    <div className="relative mb-6 w-full overflow-hidden rounded-lg border bg-white p-6">
      {/* Background Decorative Pattern - Simplistic recreation */}
      <div className="absolute top-0 left-0 h-2 w-full bg-blue-500"></div>

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
              Active Student
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200"
            >
              {metrics.courses} دورات
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200"
            >
              {metrics.hours} ساعة تعلم
            </Badge>
          </div>
        </div>

        {/* Avatar */}
        <div className="relative">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-sm md:h-32 md:w-32">
            <Avatar className="h-full w-full">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
          <button className="absolute right-1 bottom-1 rounded-full border bg-white p-2 text-gray-600 shadow-md hover:bg-gray-50">
            <Camera size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

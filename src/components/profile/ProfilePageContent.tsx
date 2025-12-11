"use client";

import { Settings, Shield, CreditCard, FileText, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInformationForm } from "./PersonalInformationForm";
import { ProfileHeader } from "./ProfileHeader";
import { Card } from "@/components/ui/card";
import { useSession } from "@/hooks/useAuthUser";
import { useRouter } from "next/navigation";

import { ProfileSkeleton } from "./ProfileSkeleton";

export function ProfilePageContent() {
  const { session, isPending } = useSession();
  const user = session?.user;
  const router = useRouter();

  if (isPending || !user) {
    return <ProfileSkeleton />;
  }

  // Mock data for initial values (would come from DB in real implementation)
  const defaultValues = {
    firstName: user?.name.split(" ")[0] || "",
    lastName: user.name.split(" ").slice(1).join(" ") || "",
    email: user.email,
    phone: "",
  };

  const metrics = {
    courses: 5,
    hours: 127,
  };

  return (
    <div className="container mx-auto max-w-5xl py-10">
      <ProfileHeader user={user} metrics={metrics} />

      <Tabs defaultValue="personal" className="w-full" dir="rtl">
        <TabsList className="mb-8 h-auto w-full justify-between rounded-none border-t-0 border-r-0 border-b border-l-0 bg-gray-50/50 p-2">
          {/* In RTL, the order is naturally right-to-left. 
               We put the items we want on the right first in source order? 
               No, standard logical order. */}

          <TabsTrigger
            value="settings"
            className="flex items-center gap-2 rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">الاعدادات</span>
          </TabsTrigger>

          <TabsTrigger
            value="invoices"
            className="flex items-center gap-2 rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">الفواتير</span>
          </TabsTrigger>

          <TabsTrigger
            value="subscriptions"
            className="flex items-center gap-2 rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">الاشتراكات</span>
          </TabsTrigger>

          <TabsTrigger
            value="security"
            className="flex items-center gap-2 rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">الامان</span>
          </TabsTrigger>

          <TabsTrigger
            value="personal"
            className="flex items-center gap-2 rounded-none bg-red-500 px-4 py-3 text-white data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <User className="h-4 w-4" />
            <span className="hidden md:inline">المعلومات الشخصية</span>
          </TabsTrigger>
        </TabsList>

        <Card className="min-h-[500px] p-6 md:p-10">
          <TabsContent value="personal" className="mt-0">
            <PersonalInformationForm defaultValues={defaultValues} />
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <div className="py-20 text-center text-gray-500">
              محتوى الأمان قريباً
            </div>
          </TabsContent>
          <TabsContent value="subscriptions" className="mt-0">
            <div className="py-20 text-center text-gray-500">
              محتوى الاشتراكات قريباً
            </div>
          </TabsContent>
          <TabsContent value="invoices" className="mt-0">
            <div className="py-20 text-center text-gray-500">
              محتوى الفواتير قريباً
            </div>
          </TabsContent>
          <TabsContent value="settings" className="mt-0">
            <div className="py-20 text-center text-gray-500">
              محتوى الاعدادات قريباً
            </div>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}

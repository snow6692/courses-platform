"use client";

import { Shield, CreditCard, FileText, User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInformationForm } from "./PersonalInformationForm";
import { ProfileHeader } from "./ProfileHeader";
import { Card } from "@/components/ui/card";
import { SecurityForm } from "./SecurityForm";
import { SubscriptionsTab } from "./SubscriptionsTab";
import { InvoicesTab } from "./InvoicesTab";
import { ProfileData } from "@/app/data/user/get-profile-data";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/providers/LanguageContext";

interface ProfilePageContentProps {
  profileData: ProfileData;
}

export function ProfilePageContent({ profileData }: ProfilePageContentProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const { t } = useLanguage();
  const { user, hasGoogleAccount, hasPassword, enrollments, metrics } =
    profileData;

  const defaultValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || "",
  };

  const tabContent: Record<string, React.ReactNode> = {
    personal: (
      <PersonalInformationForm
        defaultValues={defaultValues}
        isGoogleUser={hasGoogleAccount}
      />
    ),
    security: <SecurityForm hasPassword={hasPassword} />,
    subscriptions: <SubscriptionsTab enrollments={enrollments} />,
    invoices: <InvoicesTab enrollments={enrollments} />,
  };

  return (
    <div className="container mx-auto max-w-5xl py-10">
      <ProfileHeader user={user} metrics={metrics} />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
        dir="rtl"
      >
        <TabsList className="mb-8 h-auto w-full justify-between gap-2 rounded-xl border bg-gray-50/50 p-2">
          <TabsTrigger
            value="invoices"
            className="data-[state=active]:bg-primary flex items-center gap-2 rounded-lg px-4 py-3 transition-all data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">
              {t("profile.tabs.invoices")}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="subscriptions"
            className="data-[state=active]:bg-primary flex items-center gap-2 rounded-lg px-4 py-3 transition-all data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">
              {t("profile.tabs.subscriptions")}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-primary flex items-center gap-2 rounded-lg px-4 py-3 transition-all data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">
              {t("profile.tabs.security")}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="personal"
            className="data-[state=active]:bg-primary flex items-center gap-2 rounded-lg px-4 py-3 transition-all data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            <User className="h-4 w-4" />
            <span className="hidden md:inline">
              {t("profile.tabs.personal")}
            </span>
          </TabsTrigger>
        </TabsList>

        <Card className="min-h-[500px] overflow-hidden p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </Card>
      </Tabs>
    </div>
  );
}

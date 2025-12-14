import { getProfileData } from "@/app/data/user/get-profile-data";
import { ProfilePageContent } from "@/components/profile/ProfilePageContent";

export default async function ProfilePage() {
  const profileData = await getProfileData();

  return <ProfilePageContent profileData={profileData} />;
}

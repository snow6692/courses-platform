import { getFolders } from "@/actions/favorites/folder.actions";
import FavoritesPageClient from "./FavoritesPageClient";

export default async function FavoritesPage() {
  const folders = await getFolders();

  return <FavoritesPageClient initialFolders={folders} />;
}

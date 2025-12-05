import { getFavoriteQuestions } from "@/actions/quiz/student.actions";
import FavoritesClient from "./FavoritesClient";

export default async function FavoritesPage() {
  const favorites = await getFavoriteQuestions();

  return <FavoritesClient initialFavorites={favorites} />;
}

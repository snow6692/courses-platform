import { getFolderWithQuestions } from "@/actions/favorites/folder.actions";
import { notFound } from "next/navigation";
import FolderDetailClient from "./FolderDetailClient";

interface Props {
  params: Promise<{ folderId: string }>;
  searchParams: Promise<{ quiz?: string }>;
}

export default async function FolderDetailPage({
  params,
  searchParams,
}: Props) {
  const { folderId } = await params;
  const { quiz } = await searchParams;

  const folder = await getFolderWithQuestions(folderId);

  if (!folder) {
    notFound();
  }

  return (
    <FolderDetailClient folder={folder} startInQuizMode={quiz === "true"} />
  );
}

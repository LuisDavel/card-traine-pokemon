import { getProfileByUsername } from "@/app/actions/profile";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PublicCardView } from "./public-card-view";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return { title: "Treinador nao encontrado" };
  }

  return {
    title: `${profile.trainerName} - Trainer ID`,
    description: `Cartao de treinador Pokemon de ${profile.trainerName}${profile.city ? ` de ${profile.city}` : ""}${profile.pokemonCardName ? `. Pokemon favorito: ${profile.pokemonCardName}` : ""}`,
    openGraph: {
      title: `${profile.trainerName} - Trainer ID`,
      description: `Veja o cartao de treinador Pokemon de ${profile.trainerName}`,
      type: "profile",
    },
  };
}

export default async function PublicCardPage({ params }: Props) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  return (
    <PublicCardView
      trainerName={profile.trainerName}
      username={profile.username}
      avatarUrl={profile.avatarUrl}
      favoriteType={profile.favoriteType}
      city={profile.city}
      badges={profile.badges}
      pokemonCardImage={profile.pokemonCardImage}
      pokemonCardName={profile.pokemonCardName}
    />
  );
}

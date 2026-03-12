"use client";

import { TrainerCard } from "@/components/trainer-card/trainer-card";
import { PokemonCard } from "@/components/pokemon-card/pokemon-card";
import { TopLoaderSleeve } from "@/components/pokemon-card/top-loader-sleeve";
import { PokeballFilled, Pokeball } from "@/components/icons/pokeball";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

interface PublicCardViewProps {
  trainerName: string;
  username: string;
  avatarUrl: string | null;
  favoriteType: string | null;
  city: string | null;
  badges: string[] | null;
  pokemonCardImage: string | null;
  pokemonCardName: string | null;
}

export function PublicCardView({
  trainerName,
  username,
  avatarUrl,
  favoriteType,
  city,
  badges,
  pokemonCardImage,
  pokemonCardName,
}: PublicCardViewProps) {
  return (
    <div className="min-h-screen bg-pk-dark flex flex-col relative overflow-hidden">
      {/* BG pokeballs */}
      <Pokeball size={220} color="rgba(220,38,38,0.04)" className="absolute -top-16 -right-16 animate-pokeball-spin" />
      <Pokeball size={160} color="rgba(220,38,38,0.03)" className="absolute bottom-20 -left-12 animate-pokeball-spin" style={{ animationDirection: "reverse" }} />
      <Pokeball size={100} color="rgba(220,38,38,0.04)" className="absolute top-1/2 left-10 animate-pokeball-float" />

      {/* Red bar */}
      <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

      {/* Header */}
      <header className="border-b border-pk-border/50 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <PokeballFilled size={24} />
            <span className="text-lg font-extrabold">
              Trainer<span className="text-red-500">ID</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/register" className="pk-btn text-sm !py-2 !px-5">
              Criar Meu Cartao
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 gap-10 relative z-10">


        <div className="flex flex-col lg:flex-row mt-auto items-center gap-14">
          <TrainerCard
            trainerName={trainerName}
            avatarUrl={avatarUrl}
            favoriteType={favoriteType}
            city={city}
            badges={badges}
            username={username}
          />

          {pokemonCardImage && pokemonCardName && (
            <div className="flex flex-col items-center gap-4">
              <TopLoaderSleeve>
                <PokemonCard
                  cardImage={pokemonCardImage}
                  cardName={pokemonCardName}
                />
              </TopLoaderSleeve>
              <p className="text-pk-text-muted text-sm">
                Pokemon favorito: <span className="text-red-400 font-semibold">{pokemonCardName}</span>
              </p>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <p className="text-pk-text-muted text-xs text-center flex items-center gap-1.5 justify-center">
            <PokeballFilled size={14} />
            Crie seu proprio cartao em{" "}
            <Link href="/register" className="text-red-400 hover:text-red-300 font-medium">
              TrainerID
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

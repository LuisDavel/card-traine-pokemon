"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { getMyProfile, saveProfile } from "@/app/actions/profile";
import { CardSearch } from "@/components/card-search";
import { TrainerCard } from "@/components/trainer-card/trainer-card";
import { PokemonCard } from "@/components/pokemon-card/pokemon-card";
import { TopLoaderSleeve } from "@/components/pokemon-card/top-loader-sleeve";
import { PokeballFilled, Pokeball } from "@/components/icons/pokeball";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

const POKEMON_TYPES = [
  "fire", "water", "grass", "electric", "psychic", "ice",
  "dragon", "dark", "fairy", "normal", "fighting", "poison",
  "ground", "flying", "bug", "rock", "ghost", "steel",
];

const INSIGNIAS = [
  "Cauda de Dragão", "Collection", "Master Duel",
];

interface SelectedCard {
  id: string;
  name: string;
  image: string | null;
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [username, setUsername] = useState("");
  const [trainerName, setTrainerName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [favoriteType, setFavoriteType] = useState("");
  const [city, setCity] = useState("");
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
      return;
    }

    async function loadProfile() {
      const profile = await getMyProfile();
      if (profile) {
        setUsername(profile.username);
        setTrainerName(profile.trainerName);
        setAvatarUrl(profile.avatarUrl || "");
        setFavoriteType(profile.favoriteType || "");
        setCity(profile.city || "");
        setSelectedBadges(profile.badges || []);
        if (profile.pokemonCardId && profile.pokemonCardImage) {
          setSelectedCard({
            id: profile.pokemonCardId,
            name: profile.pokemonCardName || "",
            image: profile.pokemonCardImage,
          });
        }
      } else if (session) {
        setTrainerName(session.user.name || "");
        setUsername(
          (session.user.name || "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .slice(0, 20)
        );
      }
      setLoading(false);
    }

    if (session) loadProfile();
  }, [session, isPending, router]);

  async function handleSave() {
    if (!username || !trainerName) {
      setMessage("Preencha o username e nome do treinador");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await saveProfile({
        username,
        trainerName,
        avatarUrl: avatarUrl || undefined,
        favoriteType: favoriteType || undefined,
        city: city || undefined,
        badges: selectedBadges.length > 0 ? selectedBadges : undefined,
        pokemonCardId: selectedCard?.id || undefined,
        pokemonCardImage: selectedCard?.image || undefined,
        pokemonCardName: selectedCard?.name || undefined,
      });
      setMessage("Perfil salvo com sucesso!");
    } catch {
      setMessage("Erro ao salvar perfil");
    }

    setSaving(false);
  }

  function toggleBadge(badge: string) {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  }

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pk-dark gap-4">
        <PokeballFilled size={40} className="animate-pokeball-float" />
        <p className="text-pk-text-muted text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pk-dark relative overflow-hidden">
      {/* BG */}
      <Pokeball size={200} color="rgba(220,38,38,0.03)" className="absolute -top-16 right-10 animate-pokeball-spin" />
      <Pokeball size={150} color="rgba(220,38,38,0.03)" className="absolute bottom-20 -left-10 animate-pokeball-spin" style={{ animationDirection: "reverse" }} />

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
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {username && (
              <a
                href={`/card/${username}`}
                target="_blank"
                className="text-sm text-pk-text-secondary hover:text-red-400 transition-colors flex items-center gap-1.5"
              >
                <PokeballFilled size={14} />
                Ver meu cartao
              </a>
            )}
            <button
              onClick={() => signOut().then(() => router.push("/login"))}
              className="text-sm text-pk-text-muted hover:text-red-400 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="space-y-5">
            <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
              <PokeballFilled size={24} />
              Editar Cracha
            </h2>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-pk-text-secondary mb-1.5">
                Username (URL do seu cartao)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-pk-text-muted text-sm font-mono">/card/</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "").slice(0, 30)
                    )
                  }
                  className="pk-input flex-1"
                  placeholder="ash-ketchum"
                />
              </div>
            </div>

            {/* Trainer Name */}
            <div>
              <label className="block text-sm font-medium text-pk-text-secondary mb-1.5">
                Nome do Treinador
              </label>
              <input
                type="text"
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                className="pk-input"
                placeholder="Ash Ketchum"
              />
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-medium text-pk-text-secondary mb-1.5">
                URL do Avatar
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="pk-input"
                placeholder="https://exemplo.com/avatar.png"
              />
            </div>

            {/* Favorite Type */}
            <div>
              <label className="block text-sm font-medium text-pk-text-secondary mb-2">
                Tipo Favorito
              </label>
              <div className="grid grid-cols-6 gap-2">
                {POKEMON_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFavoriteType(favoriteType === type ? "" : type)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      favoriteType === type
                        ? "bg-red-500 text-white ring-2 ring-red-400/50 shadow-lg shadow-red-500/20"
                        : "bg-pk-surface text-pk-text-secondary hover:bg-pk-card border border-pk-border"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-pk-text-secondary mb-1.5">
                Cidade
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="pk-input"
                placeholder="Pallet Town"
              />
            </div>

            {/* Insígnias */}
            <div>
              <label className="block text-sm font-medium text-pk-text-secondary mb-2">
                Insígnias Conquistadas
              </label>
              <div className="flex flex-wrap gap-2">
                {INSIGNIAS.map((badge) => (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => toggleBadge(badge)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedBadges.includes(badge)
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                        : "bg-pk-surface text-pk-text-secondary hover:bg-pk-card border border-pk-border"
                    }`}
                  >
                    {badge}
                  </button>
                ))}
              </div>
            </div>

            {/* Pokemon Card Search */}
            <CardSearch
              onSelect={(card) => setSelectedCard(card.id ? card : null)}
              selectedCard={selectedCard}
            />

            {/* Save */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="pk-btn flex items-center gap-2"
              >
                <PokeballFilled size={18} />
                {saving ? "Salvando..." : "Salvar Perfil"}
              </button>
              {message && (
                <p
                  className={`text-sm font-medium ${
                    message.includes("sucesso")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-8">
            <h2 className="text-2xl font-extrabold mb-6">Preview</h2>

            <div className="flex justify-center">
              <TrainerCard
                trainerName={trainerName || "Seu Nome"}
                avatarUrl={avatarUrl || null}
                favoriteType={favoriteType || null}
                city={city || null}
                badges={selectedBadges.length > 0 ? selectedBadges : null}
                username={username || "username"}
              />
            </div>

            {selectedCard?.image && (
              <div className="flex justify-center">
                <TopLoaderSleeve>
                  <PokemonCard
                    cardImage={selectedCard.image}
                    cardName={selectedCard.name}
                  />
                </TopLoaderSleeve>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

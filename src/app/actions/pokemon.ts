"use server";

import TCGdex, { Query } from "@tcgdex/sdk";

const tcgdex = new TCGdex("en");

export async function searchPokemonCards(query: string) {
  if (!query || query.length < 2) return [];

  try {
    const results = await tcgdex.card.list(
      Query.create().contains("name", query).paginate(1, 20)
    );

    if (!results || !Array.isArray(results)) return [];

    return results.map((card) => ({
      id: card.id,
      name: card.name,
      image: card.image ? `${card.image}/high.webp` : null,
    }));
  } catch {
    return [];
  }
}

export async function getPokemonCard(cardId: string) {
  try {
    const card = await tcgdex.card.get(cardId);
    if (!card) return null;

    return {
      id: card.id,
      name: card.name,
      image: card.image ? `${card.image}/high.webp` : null,
      hp: card.hp,
      types: card.types,
      rarity: card.rarity,
    };
  } catch {
    return null;
  }
}

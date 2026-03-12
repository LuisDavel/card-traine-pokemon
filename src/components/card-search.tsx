"use client";

import { useState, useCallback } from "react";
import { searchPokemonCards } from "@/app/actions/pokemon";
import Image from "next/image";
import { PokeballFilled } from "@/components/icons/pokeball";

interface CardResult {
  id: string;
  name: string;
  image: string | null;
}

interface CardSearchProps {
  onSelect: (card: CardResult) => void;
  selectedCard?: CardResult | null;
}

export function CardSearch({ onSelect, selectedCard }: CardSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CardResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const search = useCallback(async (value: string) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    const cards = await searchPokemonCards(value);
    setResults(cards);
    setOpen(true);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-pk-text-secondary">
        Carta Pokemon Favorita
      </label>

      {selectedCard && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-pk-surface border border-pk-border">
          {selectedCard.image && (
            <Image
              src={selectedCard.image}
              alt={selectedCard.name}
              width={60}
              height={84}
              className="rounded"
              unoptimized
            />
          )}
          <div className="flex-1">
            <p className="text-pk-text font-medium">{selectedCard.name}</p>
            <p className="text-pk-text-muted text-xs">{selectedCard.id}</p>
          </div>
          <button
            type="button"
            onClick={() => onSelect({ id: "", name: "", image: null })}
            className="text-pk-text-muted hover:text-red-400 text-sm transition-colors"
          >
            Remover
          </button>
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => search(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder="Buscar carta por nome..."
          className="pk-input"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <PokeballFilled size={16} className="animate-spin" />
          </div>
        )}

        {open && results.length > 0 && (
          <div className="absolute z-50 w-full mt-1 max-h-80 overflow-y-auto rounded-xl bg-pk-surface border border-pk-border shadow-2xl">
            {results.map((card) => (
              <button
                key={card.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(card);
                  setOpen(false);
                  setQuery("");
                }}
                className="flex items-center gap-3 w-full p-2.5 hover:bg-pk-card transition-colors text-left"
              >
                {card.image && (
                  <Image
                    src={card.image}
                    alt={card.name}
                    width={40}
                    height={56}
                    className="rounded"
                    unoptimized
                  />
                )}
                <div>
                  <p className="text-pk-text text-sm font-medium">{card.name}</p>
                  <p className="text-pk-text-muted text-xs">{card.id}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

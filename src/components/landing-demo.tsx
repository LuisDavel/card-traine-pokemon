"use client";

import { TrainerCard } from "@/components/trainer-card/trainer-card";

export function LandingDemo() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-12">
      <TrainerCard
        trainerName="Ash Ketchum"
        avatarUrl={null}
        favoriteType="electric"
        city="Pallet Town"
        badges={["Boulder", "Cascade", "Thunder", "Rainbow", "Soul", "Marsh", "Volcano", "Earth"]}
        username="ash"
      />
    </div>
  );
}

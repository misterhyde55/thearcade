import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { slug: "speedrunning", name: "Speedrunning", emoji: "⏱️" },
  { slug: "fighting-games", name: "Fighting Games", emoji: "🥊" },
  { slug: "platformers", name: "Platformers", emoji: "🍄" },
  { slug: "shmups", name: "Shoot-'Em-Ups", emoji: "🚀" },
  { slug: "puzzle", name: "Puzzle Cabinets", emoji: "🧩" },
  { slug: "chiptune-music", name: "Chiptune & Music", emoji: "🎵" },
  { slug: "just-chatting", name: "Coin-Op Lounge", emoji: "🪙" },
  { slug: "high-score-attempts", name: "High Score Attempts", emoji: "👾" }
];

async function main() {
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c
    });
  }
  console.log(`Seeded ${categories.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

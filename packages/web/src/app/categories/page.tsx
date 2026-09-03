"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api<{ categories: Category[] }>("/api/categories").then((data) => setCategories(data.categories));
  }, []);

  return (
    <div>
      <h1 className="mb-4 font-pixel text-lg text-neon-cyan">CABINETS</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="rounded-lg border-2 border-arcade-border bg-arcade-panel p-5 text-center hover:border-arcade-yellow hover:shadow-cabinet"
          >
            <div className="text-4xl">{c.emoji}</div>
            <p className="mt-2 font-mono text-white">{c.name}</p>
            <p className="font-mono text-xs text-arcade-cyan/60">{c.liveCount} live now</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

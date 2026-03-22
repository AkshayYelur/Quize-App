// src/app/(dashboard)/history/page.tsx
"use client";

import { useEffect, useState } from "react";

type SavedTest = {
  id: number;
  topic: string;
  difficulty: string;
  totalQuestions: number;
  correct: number;
  wrong: number;
  scorePercent: number;
  createdAt: string;
};

export default function HistoryPage() {
  const [items, setItems] = useState<SavedTest[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/history");
        const ct = res.headers.get("content-type") || "";
        if (!res.ok) {
          const text = await res.text();
          console.error("History API error (non-json):", text);
          throw new Error(`Server returned ${res.status}`);
        }
        if (!ct.includes("application/json")) {
          const text = await res.text();
          console.error("Expecting JSON from /api/history but got:", text);
          throw new Error("Unexpected server response for history.");
        }
        const data = await res.json();
        setItems(data.items || []);
      } catch (err: any) {
        console.error("Failed to load history:", err);
        setError(err?.message || "Failed to fetch history.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Test History</h1>
      {loading && <p className="subtle">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && items && items.length === 0 && <p className="subtle">No tests yet.</p>}

      <div className="grid gap-3">
        {items?.map((it) => (
          <div className="card" key={it.id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{it.topic}</div>
                <div className="text-sm text-zinc-500">{it.difficulty} • {it.totalQuestions} questions</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-blue-600">{it.scorePercent}%</div>
                <div className="text-xs text-zinc-500">{new Date(it.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

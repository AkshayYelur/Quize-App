// src/app/(dashboard)/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/history");
        if (!res.ok) throw new Error("Failed to fetch history");
        const json = await res.json();
        const items = json.items || [];

        // simple aggregation: average score per topic (top 6)
        const map = new Map<string, number[]>();
        items.forEach((it: any) => {
          const key = it.topic || "Unknown";
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(it.scorePercent || 0);
        });
        const labels = Array.from(map.keys()).slice(0, 6);
        const avg = labels.map((l) => {
          const arr = map.get(l) || [];
          return Math.round(arr.reduce((a, b) => a + b, 0) / (arr.length || 1));
        });

        setData({
          labels,
          datasets: [
            {
              label: "Avg Score (%)",
              data: avg,
            },
          ],
        });
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      {loading && <p className="subtle">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {data && (
        <div className="card mt-4">
          <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      )}
    </div>
  );
}
  
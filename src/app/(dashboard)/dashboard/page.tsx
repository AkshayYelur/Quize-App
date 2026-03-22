// // src/app/(dashboard)/dashboard/page.tsx
// export default function DashboardPage() {
//   return (
//     <div className="mx-auto max-w-7xl px-6 py-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-extrabold">Your Learning Dashboard</h2>
//           <p className="text-sm text-zinc-500 mt-1">Track your progress and master new topics</p>
//         </div>
//         {/* Removed duplicate "New Quiz" buttons — sidebar has single button */}
//       </div>

//       <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div className="card">
//               <p className="text-sm text-zinc-500">Total Quizzes</p>
//               <div className="text-2xl font-bold mt-2">0</div>
//             </div>
//             <div className="card">
//               <p className="text-sm text-zinc-500">Average Score</p>
//               <div className="text-2xl font-bold mt-2">0%</div>
//             </div>
//             <div className="card">
//               <p className="text-sm text-zinc-500">Topics Studied</p>
//               <div className="text-2xl font-bold mt-2">0</div>
//             </div>
//             <div className="card">
//               <p className="text-sm text-zinc-500">Recent Streak</p>
//               <div className="text-2xl font-bold mt-2">0/5</div>
//             </div>
//           </div>

//           <div className="card mt-4">
//             <h3 className="font-semibold mb-2">Recent Quizzes</h3>
//             <p className="text-sm text-zinc-500">You don't have any quizzes yet — create one to get started.</p>
//           </div>
//         </div>

//         <aside className="card">
//           <h3 className="font-semibold">Performance by Level</h3>
//           <div className="mt-4 space-y-3">
//             {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
//               <div key={lvl}>
//                 <div className="flex justify-between text-sm text-zinc-600">
//                   <span>{lvl}</span>
//                   <span>0% (0 quizzes)</span>
//                 </div>
//                 <div className="h-2 bg-zinc-100 rounded-full mt-2">
//                   <div className="h-2 rounded-full" style={{ width: "0%", background: "linear-gradient(90deg,#bbf7d0,#fff1b8)" }} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }

//2
"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    avgScore: 0,
    topics: 0,
    streak: 0,
    recent: [],
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        const items = data.items || [];

        const total = items.length;

        const avgScore =
          total > 0
            ? Math.round(
                items.reduce((a: number, b: any) => a + (b.scorePercent || 0), 0) / total
              )
            : 0;

        const topics = new Set(items.map((it: any) => it.topic)).size;

        const streak = items.slice(0, 5).filter((it: any) => it.scorePercent > 60).length;

        setStats({
          total,
          avgScore,
          topics,
          streak,
          recent: items.slice(0, 5),
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    }

    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold">Your Learning Dashboard</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Track your progress and master new topics
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-sm text-zinc-500">Total Quizzes</p>
              <div className="text-2xl font-bold mt-2">{stats.total}</div>
            </div>

            <div className="card">
              <p className="text-sm text-zinc-500">Average Score</p>
              <div className="text-2xl font-bold mt-2">{stats.avgScore}%</div>
            </div>

            <div className="card">
              <p className="text-sm text-zinc-500">Topics Studied</p>
              <div className="text-2xl font-bold mt-2">{stats.topics}</div>
            </div>

            <div className="card">
              <p className="text-sm text-zinc-500">Recent Streak</p>
              <div className="text-2xl font-bold mt-2">{stats.streak}/5</div>
            </div>
          </div>

          {/* RECENT */}
          <div className="card mt-4">
            <h3 className="font-semibold mb-2">Recent Quizzes</h3>

            {stats.recent.length === 0 ? (
              <p className="text-sm text-zinc-500">
                You don't have any quizzes yet — create one to get started.
              </p>
            ) : (
              <div className="space-y-2">
                {stats.recent.map((it: any) => (
                  <div key={it.id} className="flex justify-between text-sm">
                    <span>{it.topic}</span>
                    <span className="text-blue-600 font-medium">
                      {it.scorePercent}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PERFORMANCE */}
        <aside className="card">
          <h3 className="font-semibold">Performance by Level</h3>

          <div className="mt-4 space-y-3">
            {["Easy", "Medium", "Hard"].map((lvl) => {
              const filtered = stats.recent.filter(
                (it: any) => it.difficulty === lvl
              );

              const avg =
                filtered.length > 0
                  ? Math.round(
                      filtered.reduce((a: number, b: any) => a + b.scorePercent, 0) /
                        filtered.length
                    )
                  : 0;

              return (
                <div key={lvl}>
                  <div className="flex justify-between text-sm text-zinc-600">
                    <span>{lvl}</span>
                    <span>
                      {avg}% ({filtered.length} quizzes)
                    </span>
                  </div>

                  <div className="h-2 bg-zinc-100 rounded-full mt-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${avg}%`,
                        background:
                          "linear-gradient(90deg,#bbf7d0,#fff1b8)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
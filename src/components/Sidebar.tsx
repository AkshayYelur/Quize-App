// src/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Create Quiz", href: "/create" },
  { name: "History", href: "/history" },
  { name: "Analytics", href: "/analytics" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-zinc-100 min-h-screen flex flex-col px-6 py-8">
      <div className="mb-8">
        <h1 className="text-lg font-bold">QuizMaster AI</h1>
        <p className="text-xs text-zinc-500 mt-1">Powered by AI</p>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 font-medium text-sm transition ${
                active ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md" : "text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        <Link href="/create" className="inline-block w-full text-center btn">
          + New Quiz
        </Link>
      </div>
    </aside>
  );
}

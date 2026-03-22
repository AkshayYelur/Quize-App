// src/app/(dashboard)/layout.tsx
import Sidebar from "@/components/Sidebar";
import "@/app/globals.css"; // adjust path if needed

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-[transparent]">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

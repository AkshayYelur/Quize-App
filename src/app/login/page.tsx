// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // simple mock validation - replace with real auth later
    if (!email || !password) return alert("Enter email and password");
    // pretend login succeeded
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Quiz-vala</h1>
          <p className="text-sm text-zinc-600">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <label className="label">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" placeholder="you@example.com" />

          <label className="label mt-4">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="input" placeholder="••••••••" />

          <div className="flex items-center justify-between mt-4">
            <button className="btn" type="submit">Login</button>
            <div className="text-sm">
              <Link href="/signup" className="link">Sign up</Link>
              <span className="mx-2">·</span>
              <Link href="/login/recover" className="link">Forgot?</Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

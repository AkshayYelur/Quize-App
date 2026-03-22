// src/app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !pw || pw !== pw2) {
      return alert("Please fill and ensure passwords match");
    }
    // mock create -> redirect to dashboard
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Create account</h1>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <label className="label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />

          <label className="label mt-3">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />

          <label className="label mt-3">Password</label>
          <input className="input" value={pw} onChange={(e) => setPw(e.target.value)} type="password" />

          <label className="label mt-3">Confirm password</label>
          <input className="input" value={pw2} onChange={(e) => setPw2(e.target.value)} type="password" />

          <div className="flex items-center justify-between mt-4">
            <button className="btn" type="submit">Sign up</button>
            <Link href="/login" className="link">Back to login</Link>
          </div>
        </form>
      </div>
    </main>
  );
}

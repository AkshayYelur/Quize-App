// src/app/page.tsx  (replace current file)
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}

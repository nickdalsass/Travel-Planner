import HomePage from "@/components/HomePage";
import { Metadata } from "next";

// metadata can only come from a ssr component I guess... I moved this from layout.tsx
export const metadata: Metadata = {
  title: "Travel Planner",
  description: "Software Engineering Final Project 2025",
};

export default function Home() {
  return (
    <HomePage />
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteBotButton({ botId }: { botId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (
      !confirm("Delete this bot? All its content will be permanently removed.")
    )
      return;

    setLoading(true);
    const res = await fetch(`/api/bots/${botId}`, { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to delete bot");
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-600 hover:text-red-700 disabled:text-gray-400"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
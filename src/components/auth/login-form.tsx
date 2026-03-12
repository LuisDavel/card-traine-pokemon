"use client";

import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn.email({ email, password });

    if (error) {
      setError(error.message || "Erro ao fazer login");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-pk-text-secondary mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="pk-input"
          placeholder="treinador@pokemon.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-pk-text-secondary mb-1.5">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="pk-input"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
      )}

      <button type="submit" disabled={loading} className="pk-btn w-full text-center">
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

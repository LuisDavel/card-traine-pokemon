"use client";

import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${theme === "dark"
        ? "bg-pk-surface border border-pk-border"
        : "bg-pk-card border border-pk-border"
        } ${className}`}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-xs">
        <Sun className="text-pk-text-secondary" size={16} />
      </span>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs">
        <Moon className="text-pk-text-secondary" size={16} />
      </span>
      {/* Thumb */}
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${theme === "dark"
          ? "left-0.5 bg-pk-card"
          : "left-[calc(100%-1.625rem)] bg-white"
          }`}
      />
    </button>
  );
}

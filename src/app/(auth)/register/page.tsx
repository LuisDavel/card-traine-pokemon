import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";
import { PokeballFilled, Pokeball } from "@/components/icons/pokeball";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-pk-dark flex relative overflow-hidden">
      {/* BG Pokeballs */}
      <Pokeball size={250} color="rgba(220,38,38,0.04)" className="absolute -top-20 -left-20 animate-pokeball-spin" />
      <Pokeball size={180} color="rgba(220,38,38,0.03)" className="absolute bottom-10 -right-16 animate-pokeball-spin" style={{ animationDirection: "reverse" }} />
      <Pokeball size={100} color="rgba(220,38,38,0.04)" className="absolute top-1/3 left-1/4 animate-pokeball-float" />

      {/* Red bar top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Left panel - form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <div className="pk-glass p-8 w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
            <PokeballFilled size={28} />
            <span className="text-xl font-extrabold">
              Trainer<span className="text-red-500">ID</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold text-pk-text mb-1 text-center lg:text-left">
            Comece sua jornada
          </h2>
          <p className="text-pk-text-muted text-sm mb-6 text-center lg:text-left">
            Crie sua conta de treinador Pokemon
          </p>

          <RegisterForm />

          <p className="mt-6 text-pk-text-muted text-sm text-center">
            Ja tem uma conta?{" "}
            <Link href="/login" className="text-red-400 hover:text-red-300 font-medium">
              Entrar
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel - branding (hidden mobile) */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center relative">
        <div className="text-center">
          <PokeballFilled size={80} className="mx-auto mb-6 animate-pokeball-float" />
          <h1 className="text-4xl font-black mb-3">
            Trainer<span className="text-red-500">ID</span>
          </h1>
          <p className="text-pk-text-muted max-w-xs">
            Monte seu cracha, escolha sua carta e compartilhe com o mundo
          </p>
        </div>
      </div>
    </div>
  );
}

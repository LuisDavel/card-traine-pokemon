import Link from "next/link";
import { LandingDemo } from "@/components/landing-demo";
import { Pokeball, PokeballFilled, GreatBall, UltraBall } from "@/components/icons/pokeball";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-pk-dark text-pk-text overflow-hidden relative">
      {/* Floating pokeballs background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <Pokeball size={180} color="rgba(220,38,38,0.06)" className="absolute -top-10 -left-10 animate-pokeball-spin" />
        <Pokeball size={120} color="rgba(220,38,38,0.04)" className="absolute top-1/4 right-10 animate-pokeball-float" />
        <Pokeball size={200} color="rgba(220,38,38,0.05)" className="absolute bottom-20 -left-20 animate-pokeball-pulse" />
        <Pokeball size={90} color="rgba(220,38,38,0.04)" className="absolute top-2/3 right-1/4 animate-pokeball-float" style={{ animationDelay: "2s" }} />
        <Pokeball size={140} color="rgba(220,38,38,0.03)" className="absolute -bottom-10 right-10 animate-pokeball-spin" style={{ animationDelay: "5s", animationDirection: "reverse" }} />
      </div>

      {/* Red accent bar at very top */}
      <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

      {/* Header */}
      <header className="relative z-10 border-b border-pk-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <PokeballFilled size={28} />
            <span className="text-xl font-extrabold tracking-tight">
              Trainer<span className="text-red-500">ID</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="text-sm text-pk-text-secondary hover:text-pk-text transition-colors px-4 py-2">
              Entrar
            </Link>
            <Link href="/register" className="pk-btn text-sm !py-2 !px-5">
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">
          {/* Pokeball icon above title */}
          <div className="mb-6 relative">
            <PokeballFilled size={56} className="animate-pokeball-float" />
            <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-5 leading-tight">
            Seu Cartao de{" "}
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Treinador
            </span>
            <br />
            <span className="text-yellow-400">Pokemon</span>
          </h1>

          <p className="text-lg md:text-xl text-pk-text-secondary max-w-xl mb-10 leading-relaxed">
            Crie seu cracha de treinador com animacoes 3D holograficas,
            escolha sua carta favorita e compartilhe com o mundo!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link href="/register" className="pk-btn text-lg !py-3 !px-10 flex items-center gap-2">
              <PokeballFilled size={20} />
              Comecar Jornada
            </Link>
            <Link
              href="#features"
              className="text-lg py-3 px-10 rounded-xl border-2 border-pk-border text-pk-text-secondary hover:border-red-500/50 hover:text-pk-text transition-all font-semibold"
            >
              Saiba Mais
            </Link>
          </div>

          {/* Demo Cards */}
          <LandingDemo />
        </section>

        {/* Diagonal red divider */}
        <div className="relative h-24 -mt-1">
          <svg viewBox="0 0 1440 96" fill="none" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path d="M0 96L1440 0V96H0Z" fill="rgba(220,38,38,0.06)" />
            <path d="M0 96L1440 30V96H0Z" fill="rgba(220,38,38,0.04)" />
          </svg>
        </div>

        {/* Features */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Tudo que um <span className="text-red-500">Treinador</span> precisa
            </h2>
            <p className="text-pk-text-muted max-w-md mx-auto">
              Sua identidade como treinador Pokemon, digital e estilosa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="pk-glass p-7 rounded-2xl group hover:border-red-500/20 transition-all">
              <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <PokeballFilled size={30} />
              </div>
              <h3 className="text-lg font-bold mb-2">
                Cracha de Treinador
              </h3>
              <p className="text-pk-text-secondary text-sm leading-relaxed">
                Cartao estilo cracha com fita, nome, cidade, tipo favorito e badges.
                Efeitos holograficos 3D que reagem ao mouse.
              </p>
            </div>

            {/* Card 2 */}
            <div className="pk-glass p-7 rounded-2xl group hover:border-red-500/20 transition-all">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <GreatBall size={30} />
              </div>
              <h3 className="text-lg font-bold mb-2">
                Carta Pokemon
              </h3>
              <p className="text-pk-text-secondary text-sm leading-relaxed">
                Escolha sua carta Pokemon favorita do TCG e veja ela protegida
                num sleeve acrilico com brilho e reflexo realista.
              </p>
            </div>

            {/* Card 3 */}
            <div className="pk-glass p-7 rounded-2xl group hover:border-red-500/20 transition-all">
              <div className="w-14 h-14 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <UltraBall size={30} />
              </div>
              <h3 className="text-lg font-bold mb-2">
                Link Compartilhavel
              </h3>
              <p className="text-pk-text-secondary text-sm leading-relaxed">
                Receba um link unico para compartilhar seu cracha e carta
                com amigos, em torneios ou nas redes sociais.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="pk-glass p-12 rounded-3xl text-center relative overflow-hidden">
            {/* BG pokeballs */}
            <Pokeball size={200} color="rgba(220,38,38,0.05)" className="absolute -top-16 -right-16 animate-pokeball-spin" />
            <Pokeball size={150} color="rgba(220,38,38,0.04)" className="absolute -bottom-12 -left-12 animate-pokeball-spin" style={{ animationDirection: "reverse" }} />

            <div className="relative z-10">
              <PokeballFilled size={40} className="mx-auto mb-4" />
              <h2 className="text-3xl font-extrabold mb-3">
                Pronto para ser um <span className="text-red-500">Mestre Pokemon</span>?
              </h2>
              <p className="text-pk-text-secondary mb-8 max-w-md mx-auto">
                Crie sua conta gratis e monte seu cracha de treinador agora mesmo.
              </p>
              <Link href="/register" className="pk-btn text-lg !py-3 !px-10 inline-flex items-center gap-2">
                <PokeballFilled size={20} />
                Registrar Agora
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-pk-border/50 py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <PokeballFilled size={18} />
              <span className="text-sm font-bold">Trainer<span className="text-red-500">ID</span></span>
            </div>
            <p className="text-pk-text-muted text-xs">
              Feito por Luis Davel com carinho para vocês ❤️
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

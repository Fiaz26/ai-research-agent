import { Link, useLocation } from "wouter";
import { Brain, Sparkles } from "lucide-react";

export function TopNav() {
  const [location] = useLocation();
  const isResearch = location === "/" || location.startsWith("/research");
  const isBio = location.startsWith("/bio");

  return (
    <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-2.5"
        data-testid="link-home"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight">
          AI Digital Tools Hub
        </span>
      </Link>

      <nav className="flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <Link
          href="/"
          data-testid="link-research"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isResearch
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/30"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
        >
          <Brain className="w-4 h-4" />
          Research Agent
        </Link>
        <Link
          href="/bio"
          data-testid="link-bio"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isBio
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/30"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Bio Generator
        </Link>
      </nav>
    </header>
  );
}

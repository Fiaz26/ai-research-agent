import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useGenerateBio } from "@/hooks/use-bios";

const TONES = [
  "Professional", "Funny", "Sarcastic", 
  "Inspirational", "Minimalist", "Quirky",
  "Aesthetic", "Mysterious", "Aggressive"
];

export function GeneratorForm() {
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  
  const generateMutation = useGenerateBio();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) return;
    
    generateMutation.mutate({ niche, tone });
  };

  return (
    <div className="glass-card rounded-[2rem] p-6 md:p-8 relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-500" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-colors duration-500" />
      
      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
        <div className="space-y-2">
          <label htmlFor="niche" className="text-sm font-bold text-foreground/80 ml-1">
            What is your niche? <span className="text-primary">*</span>
          </label>
          <input
            id="niche"
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. Fitness coach, Tech startup, Food blogger..."
            className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
            required
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-foreground/80 ml-1">
            Select Tone
          </label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${tone === t 
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 border-transparent scale-105" 
                    : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground"}
                `}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={generateMutation.isPending || !niche.trim()}
          className="
            relative w-full overflow-hidden rounded-2xl p-[2px] mt-4
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            transition-transform duration-200 hover:-translate-y-1 active:translate-y-0
          "
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#FF2E93] via-[#FF8A00] to-[#FF2E93] animate-gradient bg-[length:200%_auto]" />
          <div className="relative bg-background/20 backdrop-blur-sm w-full rounded-[14px] px-6 py-4 flex items-center justify-center gap-3">
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span className="font-bold text-white text-lg">Crafting Magic...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-white" />
                <span className="font-bold text-white text-lg">Generate Bio</span>
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
}

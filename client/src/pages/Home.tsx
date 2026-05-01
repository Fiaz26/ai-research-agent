import { motion } from "framer-motion";
import { Sparkles, LayoutGrid } from "lucide-react";
import { GeneratorForm } from "@/components/GeneratorForm";
import { BioCard } from "@/components/BioCard";
import { useBiosHistory } from "@/hooks/use-bios";
import { TopNav } from "@/components/TopNav";
import { PageBackground } from "@/components/PageBackground";

export default function Home() {
  const { data: history, isLoading } = useBiosHistory();

  const latestBio = history && history.length > 0 ? history[0] : null;
  const previousBios = history && history.length > 1 ? history.slice(1) : [];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <PageBackground />
      <TopNav />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 flex flex-col gap-16">
        <section className="text-center max-w-3xl mx-auto pt-4 md:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight leading-[1.1] mb-6">
              Level up your <br />
              <span className="text-gradient">Instagram Presence</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium px-4">
              Stand out from the crowd. Generate catchy, perfectly formatted bios tailored to your exact niche and personality in seconds.
            </p>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GeneratorForm />
          </motion.div>
          
          <motion.div 
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {latestBio ? (
              <div className="flex flex-col h-full justify-center">
                <BioCard bio={latestBio} isLatest={true} />
              </div>
            ) : (
              <div className="h-full min-h-[400px] glass-card rounded-[2rem] flex flex-col items-center justify-center text-center p-8 border-dashed border-2 border-white/10">
                <Sparkles className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-foreground mb-2">Ready to create magic</h3>
                <p className="text-muted-foreground max-w-sm">
                  Fill out the form on the left and hit generate to see your custom Instagram bio appear here.
                </p>
              </div>
            )}
          </motion.div>
        </section>

        <section className="pt-12 border-t border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <LayoutGrid className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold font-display">Your Collection</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
              ))}
            </div>
          ) : previousBios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousBios.map((bio, index) => (
                <motion.div
                  key={bio.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <BioCard bio={bio} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-muted-foreground text-lg">No previous bios yet. Start generating!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

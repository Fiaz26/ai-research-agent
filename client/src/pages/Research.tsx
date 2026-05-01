import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, History, Search, Link2, FileBarChart } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { PageBackground } from "@/components/PageBackground";
import { ResearchTabs } from "@/components/ResearchTabs";
import { ResearchResult } from "@/components/ResearchResult";
import { useResearchHistory } from "@/hooks/use-research";
import type { ResearchResponse } from "@shared/routes";

export default function Research() {
  const [latest, setLatest] = useState<ResearchResponse | null>(null);
  const { data: history, isLoading } = useResearchHistory();

  const previous = (history ?? []).filter((h) => !latest || h.id !== latest.id);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <PageBackground />
      <TopNav />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 flex flex-col gap-16">
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto pt-4 md:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-xs font-bold uppercase tracking-wider text-primary">
              <Brain className="w-3.5 h-3.5" />
              AI Research Agent
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight leading-[1.05] mb-6">
              Research <span className="text-gradient">smarter</span>,
              <br /> not harder.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium px-4">
              Ask questions, summarize any article, and generate full research
              reports with proper citations — all in seconds.
            </p>
          </motion.div>
        </section>

        {/* Feature chips */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-8">
          <FeatureChip icon={Search} title="Ask a Question" desc="Get clear, structured answers on any topic." />
          <FeatureChip icon={Link2} title="Summarize URLs" desc="Paste any article and get the key points instantly." />
          <FeatureChip icon={FileBarChart} title="Cited Reports" desc="Build full reports from sources you choose." />
        </section>

        {/* Workspace */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ResearchTabs onResult={setLatest} />
          </motion.div>

          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {latest ? (
              <ResearchResult result={latest} />
            ) : (
              <div className="h-full min-h-[400px] glass-card rounded-[2rem] flex flex-col items-center justify-center text-center p-8 border-dashed border-2 border-white/10">
                <Brain className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Ready when you are
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Pick a mode on the left, give the agent something to work with,
                  and your answer or report will appear here.
                </p>
              </div>
            )}
          </motion.div>
        </section>

        {/* History */}
        <section className="pt-12 border-t border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <History className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold font-display">Recent Research</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-40 rounded-3xl bg-white/5 animate-pulse border border-white/10"
                />
              ))}
            </div>
          ) : previous.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {previous.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLatest(item)}
                  data-testid={`button-history-${item.id}`}
                  className="text-left glass-card rounded-3xl p-5 hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                      {item.type === "qa" && "Q&A"}
                      {item.type === "summary" && "Summary"}
                      {item.type === "report" && "Report"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.result.replace(/[#*_>`-]/g, "").slice(0, 160)}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-muted-foreground text-lg">
                Your research history will appear here.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function FeatureChip({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Brain;
  title: string;
  desc: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="font-bold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-snug">{desc}</p>
      </div>
    </div>
  );
}

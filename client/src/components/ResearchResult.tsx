import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink, FileText } from "lucide-react";
import { MarkdownView } from "./MarkdownView";
import { useToast } from "@/hooks/use-toast";
import type { ResearchResponse } from "@shared/routes";

interface ResearchResultProps {
  result: ResearchResponse;
}

export function ResearchResult({ result }: ResearchResultProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.result);
      setCopied(true);
      toast({ title: "Copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const sources = (result.sources ?? []) as { title: string; url: string }[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-[2rem] p-6 md:p-8"
      data-testid={`card-result-${result.id}`}
    >
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-muted-foreground">
          <FileText className="w-3.5 h-3.5" />
          {result.type === "qa" && "Question Answered"}
          {result.type === "summary" && "URL Summary"}
          {result.type === "report" && "Research Report"}
        </div>
        <button
          onClick={handleCopy}
          data-testid="button-copy-result"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            copied
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-white/5 text-foreground hover:bg-white/10 border border-white/10"
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <MarkdownView content={result.result} />

      {sources.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Sources
          </h4>
          <ul className="space-y-2">
            {sources.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="font-bold text-primary shrink-0">[{i + 1}]</span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-source-${i}`}
                  className="text-foreground/80 hover:text-primary underline-offset-2 hover:underline flex items-center gap-1.5 break-all"
                >
                  {s.title || s.url}
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

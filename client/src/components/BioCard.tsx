import { useState } from "react";
import { Copy, Check, Sparkles, Quote } from "lucide-react";
import { motion } from "framer-motion";
import type { Bio } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface BioCardProps {
  bio: Bio;
  isLatest?: boolean;
}

export function BioCard({ bio, isLatest = false }: BioCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bio.content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Ready to paste into Instagram!",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`
        relative group overflow-hidden rounded-3xl p-1
        ${isLatest 
          ? "bg-gradient-to-br from-[#FF2E93] via-[#FF8A00] to-[#FF2E93] shadow-2xl shadow-pink-500/20 animate-gradient bg-[length:200%_auto]" 
          : "bg-white/5 border border-white/10 hover:border-white/20 transition-colors"}
      `}
    >
      <div className={`
        relative h-full rounded-[1.4rem] p-6 flex flex-col gap-4
        ${isLatest ? "bg-background/95 backdrop-blur-xl" : "bg-transparent"}
      `}>
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              {bio.niche}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
              {bio.tone}
            </span>
          </div>
          
          {isLatest && (
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
              Latest Result
            </span>
          )}
        </div>

        {/* Content */}
        <div className="relative flex-1 py-4">
          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-white/5 -z-10 rotate-180" />
          <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed whitespace-pre-wrap">
            {bio.content}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <span className="text-xs text-muted-foreground font-medium">
            {new Date(bio.createdAt).toLocaleDateString(undefined, { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          
          <button
            onClick={handleCopy}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300
              ${copied 
                ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                : "bg-white/5 text-foreground hover:bg-white/10 border border-white/10 hover:border-white/20"}
            `}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Bio
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

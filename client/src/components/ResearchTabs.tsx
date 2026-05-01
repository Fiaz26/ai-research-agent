import { useState } from "react";
import { Loader2, Search, Link2, FileBarChart, Plus, X, Send } from "lucide-react";
import {
  useResearchQA,
  useResearchReport,
  useResearchSummarize,
} from "@/hooks/use-research";
import type { ResearchResponse } from "@shared/routes";

type Tab = "qa" | "summary" | "report";

interface Props {
  onResult: (result: ResearchResponse) => void;
}

export function ResearchTabs({ onResult }: Props) {
  const [tab, setTab] = useState<Tab>("qa");

  const tabs: { id: Tab; label: string; icon: typeof Search }[] = [
    { id: "qa", label: "Ask a Question", icon: Search },
    { id: "summary", label: "Summarize URL", icon: Link2 },
    { id: "report", label: "Research Report", icon: FileBarChart },
  ];

  return (
    <div className="glass-card rounded-[2rem] p-6 md:p-8 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/20 border border-white/10 mb-6 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                data-testid={`tab-${t.id}`}
                className={`flex-1 min-w-fit flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "qa" && <QAForm onResult={onResult} />}
        {tab === "summary" && <SummaryForm onResult={onResult} />}
        {tab === "report" && <ReportForm onResult={onResult} />}
      </div>
    </div>
  );
}

function SubmitButton({
  loading,
  loadingText,
  text,
  disabled,
}: {
  loading: boolean;
  loadingText: string;
  text: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      data-testid="button-submit"
      className="relative w-full overflow-hidden rounded-2xl p-[2px] mt-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-transform duration-200 hover:-translate-y-1 active:translate-y-0"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-[#FF2E93] via-[#FF8A00] to-[#FF2E93] animate-gradient bg-[length:200%_auto]" />
      <div className="relative bg-background/20 backdrop-blur-sm w-full rounded-[14px] px-6 py-4 flex items-center justify-center gap-3">
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-white" />
            <span className="font-bold text-white text-lg">{loadingText}</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5 text-white" />
            <span className="font-bold text-white text-lg">{text}</span>
          </>
        )}
      </div>
    </button>
  );
}

const inputBase =
  "w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300";

function QAForm({ onResult }: { onResult: (r: ResearchResponse) => void }) {
  const [question, setQuestion] = useState("");
  const mutation = useResearchQA();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    mutation.mutate(
      { question: question.trim() },
      { onSuccess: (r) => onResult(r) }
    );
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="text-sm font-bold text-foreground/80 ml-1">
        Your research question <span className="text-primary">*</span>
      </label>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. What are the most promising AI tools for small businesses in 2026?"
        rows={4}
        className={inputBase}
        data-testid="input-question"
        required
      />
      <SubmitButton
        loading={mutation.isPending}
        loadingText="Researching..."
        text="Get Answer"
        disabled={!question.trim()}
      />
    </form>
  );
}

function SummaryForm({ onResult }: { onResult: (r: ResearchResponse) => void }) {
  const [url, setUrl] = useState("");
  const mutation = useResearchSummarize();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    mutation.mutate({ url: url.trim() }, { onSuccess: (r) => onResult(r) });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="text-sm font-bold text-foreground/80 ml-1">
        URL to summarize <span className="text-primary">*</span>
      </label>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/article"
        className={inputBase}
        data-testid="input-url"
        required
      />
      <p className="text-xs text-muted-foreground ml-1">
        Paste any public article or blog post link.
      </p>
      <SubmitButton
        loading={mutation.isPending}
        loadingText="Reading article..."
        text="Summarize"
        disabled={!url.trim()}
      />
    </form>
  );
}

function ReportForm({ onResult }: { onResult: (r: ResearchResponse) => void }) {
  const [topic, setTopic] = useState("");
  const [urls, setUrls] = useState<string[]>([""]);
  const mutation = useResearchReport();

  const updateUrl = (i: number, v: string) => {
    const next = [...urls];
    next[i] = v;
    setUrls(next);
  };
  const addUrl = () => urls.length < 8 && setUrls([...urls, ""]);
  const removeUrl = (i: number) => setUrls(urls.filter((_, idx) => idx !== i));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrls = urls.map((u) => u.trim()).filter(Boolean);
    if (!topic.trim() || cleanUrls.length === 0) return;
    mutation.mutate(
      { topic: topic.trim(), urls: cleanUrls },
      { onSuccess: (r) => onResult(r) }
    );
  };

  const canSubmit =
    topic.trim().length >= 3 && urls.some((u) => u.trim().length > 0);

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-bold text-foreground/80 ml-1">
          Report topic <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. The state of AI image generators in 2026"
          className={`${inputBase} mt-2`}
          data-testid="input-topic"
          required
        />
      </div>

      <div>
        <label className="text-sm font-bold text-foreground/80 ml-1">
          Source URLs <span className="text-primary">*</span>
          <span className="text-muted-foreground font-normal ml-2">
            (1–8 sources)
          </span>
        </label>
        <div className="flex flex-col gap-2 mt-2">
          {urls.map((u, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="url"
                value={u}
                onChange={(e) => updateUrl(i, e.target.value)}
                placeholder={`https://source-${i + 1}.com/article`}
                className={inputBase}
                data-testid={`input-url-${i}`}
              />
              {urls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUrl(i)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-destructive/20 hover:text-destructive border border-white/10 transition-colors"
                  data-testid={`button-remove-url-${i}`}
                  aria-label="Remove URL"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {urls.length < 8 && (
            <button
              type="button"
              onClick={addUrl}
              data-testid="button-add-url"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-dashed border-white/15 hover:bg-white/10 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all"
            >
              <Plus className="w-4 h-4" /> Add another source
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground ml-1 mt-2">
          The agent only uses information from these sources and cites them inline.
        </p>
      </div>

      <SubmitButton
        loading={mutation.isPending}
        loadingText="Building report..."
        text="Generate Report"
        disabled={!canSubmit}
      />
    </form>
  );
}

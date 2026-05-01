import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewProps {
  content: string;
}

export function MarkdownView({ content }: MarkdownViewProps) {
  return (
    <div className="prose-research" data-testid="text-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-display font-bold mt-2 mb-4 text-gradient">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-display font-bold mt-8 mb-3 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-display font-semibold mt-6 mb-2 text-foreground">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-base leading-relaxed text-foreground/90 mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 space-y-2 mb-4 text-foreground/90 marker:text-primary">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 space-y-2 mb-4 text-foreground/90 marker:text-primary">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-secondary break-all"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="text-foreground/90">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/60 pl-4 italic text-muted-foreground my-4">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-primary text-sm font-mono">
              {children}
            </code>
          ),
          hr: () => <hr className="my-6 border-white/10" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

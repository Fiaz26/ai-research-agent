import * as cheerio from "cheerio";

export interface FetchedPage {
  url: string;
  title: string;
  text: string;
  ok: boolean;
  error?: string;
}

const MAX_BYTES = 1_500_000; // ~1.5MB cap per page
const MAX_TEXT_CHARS = 18_000; // Cap text per page so prompts stay reasonable

export async function fetchAndExtract(url: string): Promise<FetchedPage> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AIResearchAgent/1.0; +https://replit.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        url,
        title: url,
        text: "",
        ok: false,
        error: `HTTP ${res.status}`,
      };
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/") && !contentType.includes("html")) {
      return {
        url,
        title: url,
        text: "",
        ok: false,
        error: `Unsupported content type: ${contentType}`,
      };
    }

    // Read bounded number of bytes
    const reader = res.body?.getReader();
    if (!reader) {
      return { url, title: url, text: "", ok: false, error: "No response body" };
    }

    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        total += value.byteLength;
        chunks.push(value);
        if (total >= MAX_BYTES) {
          await reader.cancel();
          break;
        }
      }
    }
    const buffer = Buffer.concat(chunks.map((c) => Buffer.from(c)));
    const html = buffer.toString("utf-8");

    const $ = cheerio.load(html);

    // Drop noisy elements
    $(
      "script, style, noscript, iframe, svg, nav, header, footer, form, aside, .ad, .ads, .advertisement, [role=navigation], [role=banner], [role=contentinfo]"
    ).remove();

    const title =
      $("meta[property='og:title']").attr("content")?.trim() ||
      $("title").first().text().trim() ||
      url;

    // Prefer <article> or <main> if available, else body
    let scope = $("article").first();
    if (scope.length === 0) scope = $("main").first();
    if (scope.length === 0) scope = $("body");

    const rawText = scope.text().replace(/\s+/g, " ").trim();
    const text = rawText.slice(0, MAX_TEXT_CHARS);

    return { url, title, text, ok: true };
  } catch (err: any) {
    return {
      url,
      title: url,
      text: "",
      ok: false,
      error: err?.message ?? "Failed to fetch URL",
    };
  }
}

export async function fetchManyAndExtract(urls: string[]): Promise<FetchedPage[]> {
  return Promise.all(urls.map((u) => fetchAndExtract(u)));
}

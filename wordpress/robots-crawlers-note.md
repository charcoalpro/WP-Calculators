# Crawlability — do not block the AI/search bots

The whole point of the static layer is that AI engines and Google can read it. Make
sure `robots.txt` (Settings → Reading, or your SEO plugin) does **not** disallow any
of these user-agents:

```
# AI answer engines + search — allow
User-agent: GPTBot            # ChatGPT
User-agent: OAI-SearchBot     # ChatGPT search
User-agent: ChatGPT-User      # ChatGPT browsing on user request
User-agent: PerplexityBot     # Perplexity
User-agent: ClaudeBot         # Claude
User-agent: Claude-Web        # Claude browsing
User-agent: Google-Extended   # Google AI (Gemini / AI Overviews training)
User-agent: Bingbot           # Bing / Copilot
Allow: /
```

Notes:
- A bare WordPress install does not block these by default, but SEO/security plugins
  and some hosts add blanket bot blocks — check before launch.
- `Google-Extended` controls Google's AI use specifically; blocking it can keep you
  out of AI Overviews even while normal Googlebot still indexes you.
- Also confirm no server/CDN firewall rule (e.g. Cloudflare "block AI bots") is on.

## llms.txt
Upload `llms.txt` to the site root (`https://charcoal.pro/llms.txt`). It is cheap
infrastructure and a parity signal — not a proven ranking or citation lever, so do
not over-invest in it. The real work is the server-rendered static blocks.

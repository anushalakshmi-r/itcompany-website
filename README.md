# Northstar IT website

A React and Vite website with Tailwind CSS, an AI chat assistant, and
Gemini-generated FAQs.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `GEMINI_API_KEY` to your Gemini API
   key. The key is read by the server and is never included in the browser app.
   The server tries `GEMINI_MODEL` first and falls back to
   `GEMINI_FALLBACK_MODEL` when Gemini is busy or times out.
3. Run `npm run dev`. Vite serves the website and proxies `/api` requests to
   the local API server.

The chat assistant and generated FAQs require a valid Gemini API key. If the
key is not configured or Gemini is unavailable, the page displays an error and
the FAQ section falls back to its built-in questions.

## Production

Run `npm run build`, then `npm start` with the same environment variables.
The Node server serves the generated `dist` website and handles the Gemini API
requests. Restart the server after changing `.env`.

## Checks

- `npm run lint`
- `npm run build`

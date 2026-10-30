# قرآن و سنت AI | Quran & Sunnah AI

A bilingual Urdu/English Islamic learning website with Quran reading, prayer times, Hadith collection links, and a cautious AI learning assistant.

## Run locally

This project uses Vercel Functions for the server-side AI endpoint.

1. Install the Vercel CLI and run `vercel dev` from the project folder.
2. Add an environment variable named `OPENAI_API_KEY` in your local Vercel environment.
3. Optional: set `OPENAI_MODEL` to a model enabled for your API account. The default is `gpt-5.5`.
4. Open the local URL printed by Vercel.

## Deploy on Vercel

1. Sign in to Vercel and choose **Add New → Project**.
2. Import the GitHub repository `samas804/quran-o-sunnah-ai`.
3. In the project settings, open **Environment Variables**.
4. Add `OPENAI_API_KEY` and paste your secret API key as its value. Optionally add `OPENAI_MODEL`.
5. Deploy the project.

**Security:** Never put the API key in `index.html`, browser JavaScript, GitHub files, or a public message. Keep it only in Vercel Environment Variables. If a key is accidentally exposed, revoke it and create a new one.

## Important religious-content limitation

The AI endpoint is a cautious general learning assistant. It does **not** yet search a verified Quran/Hadith corpus. It is instructed not to invent verse numbers, Hadith numbers, authenticity grades, or fatwas. Do not present its output as a verified religious ruling. A verified source collection and scholar review process are still required before making source-grounded religious claims.

## Project files

- `index.html` — bilingual website interface
- `api/ask.js` — server-side AI endpoint; reads the secret key from environment variables

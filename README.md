# World Cup Data Portal

Notion-style FIFA World Cup data portal with live schedule, standings, team stats, player rankings, match details, media, news, data notes, and Polymarket odds.

## Local Development

```bash
npm ci
npm run sync:data
npm run dev
```

The app reads the generated public dataset from `public/data/worldcup-live.json`.

## EdgeOne Pages

Recommended EdgeOne Pages settings:

- Framework preset: Vite
- Install command: `npm ci`
- Build command: `npm run sync:data && npm run build`
- Output directory: `dist`
- Node.js version: `22.11.0`
- Deployment branch: `main`

These settings are also recorded in `edgeone.json`, so importing the GitHub repository into EdgeOne Pages can reuse the same build configuration. The build command refreshes ESPN and Polymarket data before packaging the static site.

## Scheduled Data Updates

`.github/workflows/update-worldcup-data.yml` refreshes `public/data/worldcup-live.json` every 15 minutes. If EdgeOne Pages is connected to the GitHub repository, each data commit can trigger a new EdgeOne deployment.

For GitHub Actions deployment, add a repository secret named `EDGEONE_API_TOKEN`. The `Deploy to EdgeOne Pages` workflow refreshes data, builds `dist`, and runs:

```bash
npx edgeone pages deploy ./dist -n world-cup-data-portal -t "$EDGEONE_API_TOKEN"
```

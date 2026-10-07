# My Wealth — Netlify deployment

This is the clean source package. It must be deployed as a build project; do not double-click index.html.

## Netlify
1. Put this folder in a GitHub repository.
2. In Netlify choose Add new project → Import an existing project → GitHub.
3. Select the repository.
4. Netlify will read `netlify.toml` automatically.
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Deploy.

## Local
npm install
npm run build
npm run preview

The app is a Vite/React PWA. A source package cannot be opened directly as a finished website because the React modules need to be bundled first.

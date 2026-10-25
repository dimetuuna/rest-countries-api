import { copyFile } from 'node:fs/promises'

// GitHub Pages serves 404.html for unknown paths; a copy of the SPA shell keeps
// /repo/country/BEL working on a hard refresh.
await copyFile('dist/index.html', 'dist/404.html')

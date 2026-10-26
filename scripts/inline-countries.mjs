import { readFile, writeFile } from 'node:fs/promises'

// The app renders from data.json fetched after hydration, so the `load` event
// fires before any country exists — anything that captures the page at `load`
// (deployment previews, link unfurlers) sees the loading state. Inlining the
// dataset into the shell makes the first render complete; getCountries() falls
// back to the request when the element is absent (dev server, legacy input).
const SHELL = 'dist/index.html'
const DATA = 'public/data.json'
const MARKER = '<script type="module"'
const ID = 'countries-data'

const html = await readFile(SHELL, 'utf8')
if (html.includes(`id="${ID}"`)) {
  throw new Error(`${SHELL} already contains the inline dataset`)
}

const markerIndex = html.indexOf(MARKER)
if (markerIndex === -1) {
  throw new Error(`No module script found in ${SHELL}`)
}

// `<` is escaped so a value such as "</script>" cannot close the tag early;
// \u003c is a valid JSON escape, so the payload parses to the same strings.
const json = (await readFile(DATA, 'utf8')).replace(/</g, '\\u003c')
const inline = `<script type="application/json" id="${ID}">${json}</script>\n    `

await writeFile(SHELL, html.slice(0, markerIndex) + inline + html.slice(markerIndex))

const written = await readFile(SHELL, 'utf8')
if (!written.includes(`id="${ID}"`)) {
  throw new Error(`Failed to inline the dataset into ${SHELL}`)
}

// No external dependencies: safe to run on CI and on contributor machines.
const fs = require('node:fs')
const path = require('node:path')
const root = path.join(__dirname, '..', 'src', 'renderer', 'src', 'localization')
const english = require(path.join(root, 'en.json'))
const locales = ['it', 'pt-BR']
const normalize = (text) => [...String(text).matchAll(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g)].map((m) => m[1]).sort().join(',')
const problems = []
for (const locale of locales) {
  const table = JSON.parse(fs.readFileSync(path.join(root, `${locale}.json`), 'utf8'))
  for (const key of Object.keys(english)) {
    if (!(key in table)) problems.push(`${locale}: missing key ${key}`)
    else if (normalize(table[key]) !== normalize(english[key])) problems.push(`${locale}: placeholders mismatch in ${key}`)
  }
  for (const key of Object.keys(table)) if (!(key in english)) problems.push(`${locale}: unexpected key ${key}`)
}
if (problems.length) {
  console.error(problems.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Valid localization files: ${Object.keys(english).length} keys in en/it/pt-BR`)
}

// Script d'indexation du contenu Markdown dans Typesense
// Dépendances : npm install typesense markdown-it

import fs from 'fs'
import Typesense from 'typesense'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

// Config Typesense (adapter selon ton instance)
const typesense = new Typesense.Client({
  nodes: [
    {
      host: 'localhost',
      port: 8108,
      protocol: 'http',
    },
  ],
  apiKey: 'xyz', // Remplace par ta clé admin Typesense
  connectionTimeoutSeconds: 5,
})

const COLLECTION_NAME = 'cours_chunks'

async function createCollection() {
  try {
    await typesense.collections(COLLECTION_NAME).delete()
  } catch {}
  await typesense.collections().create({
    name: COLLECTION_NAME,
    fields: [
      { name: 'id', type: 'string' },
      { name: 'module', type: 'string', facet: true },
      { name: 'section', type: 'string', facet: true },
      { name: 'content', type: 'string' },
    ],
    // default_sorting_field retiré car 'id' est de type string
  })
}

function parseMarkdownToChunks(markdown) {
  const lines = markdown.split('\n')
  let currentModule = ''
  let currentSection = ''
  let buffer = []
  let chunks = []
  let chunkId = 1
  let sommaireLines = []
  let inSommaire = false

  // 1. Extraire le sommaire (liste des modules)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.match(/^##\s*\*\*Module/)) {
      sommaireLines.push(line.replace(/^##\s*\*\*/, '').replace('**', '').trim())
    }
    // Arrêter le sommaire à la première section détaillée
    if (line.startsWith('# ')) break
  }
  if (sommaireLines.length) {
    chunks.push({
      id: String(chunkId++),
      module: 'SOMMAIRE',
      section: '',
      content: 'Liste des modules :\n' + sommaireLines.map((m, i) => `${i+1}. ${m}`).join('\n'),
    })
  }

  // 2. Découpage classique par module/section
  for (let line of lines) {
    if (line.match(/^##\s*\*\*Module/)) {
      if (buffer.length) {
        chunks.push({
          id: String(chunkId++),
          module: currentModule,
          section: currentSection,
          content: buffer.join('\n').trim(),
        })
        buffer = []
      }
      currentModule = line.replace(/^##\s*\*\*/, '').replace('**', '').trim()
      currentSection = ''
    } else if (line.startsWith('### ')) {
      if (buffer.length) {
        chunks.push({
          id: String(chunkId++),
          module: currentModule,
          section: currentSection,
          content: buffer.join('\n').trim(),
        })
        buffer = []
      }
      currentSection = line.replace('### ', '').trim()
    } else {
      buffer.push(line)
    }
  }
  if (buffer.length) {
    chunks.push({
      id: String(chunkId++),
      module: currentModule,
      section: currentSection,
      content: buffer.join('\n').trim(),
    })
  }
  return chunks.filter((c) => c.content.length > 30)
}

async function main() {
  const markdown = fs.readFileSync('docs/Refonte_Canvas_LMS.md', 'utf-8')
  const chunks = parseMarkdownToChunks(markdown)
  await createCollection()
  await typesense.collections(COLLECTION_NAME).documents().import(chunks, { action: 'upsert' })
  console.log(`Indexation terminée : ${chunks.length} chunks.`)
}

main().catch(console.error)

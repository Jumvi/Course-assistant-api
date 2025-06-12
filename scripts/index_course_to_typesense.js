// Script d'indexation du contenu Markdown dans Typesense
// Dépendances : npm install typesense markdown-it

const fs = require('fs')
const Typesense = require('typesense')
const MarkdownIt = require('markdown-it')

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
    default_sorting_field: 'id',
  })
}

function parseMarkdownToChunks(markdown) {
  // Découpe par titres de niveau 2 (##) ou 3 (###)
  const lines = markdown.split('\n')
  let currentModule = ''
  let currentSection = ''
  let buffer = []
  let chunks = []
  let chunkId = 1

  for (let line of lines) {
    if (line.startsWith('## ')) {
      if (buffer.length) {
        chunks.push({
          id: String(chunkId++),
          module: currentModule,
          section: currentSection,
          content: buffer.join('\n').trim(),
        })
        buffer = []
      }
      currentModule = line.replace('## ', '').trim()
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
  // Dernier chunk
  if (buffer.length) {
    chunks.push({
      id: String(chunkId++),
      module: currentModule,
      section: currentSection,
      content: buffer.join('\n').trim(),
    })
  }
  return chunks.filter((c) => c.content.length > 30) // Ignore les petits chunks
}

async function main() {
  const markdown = fs.readFileSync('cours.md', 'utf-8')
  const chunks = parseMarkdownToChunks(markdown)
  await createCollection()
  await typesense.collections(COLLECTION_NAME).documents().import(chunks, { action: 'upsert' })
  console.log(`Indexation terminée : ${chunks.length} chunks.`)
}

main().catch(console.error)

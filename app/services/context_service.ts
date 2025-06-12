// Service pour interroger Typesense et construire le contexte pour OpenAI
// Dépendances : npm install typesense

import Typesense from 'typesense'

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

export async function getContextForQuestion(question: string) {
  // Recherche sémantique simple (fulltext). Pour du vectoriel, voir Typesense Hybrid Search ou Qdrant.
  const searchParameters = {
    q: question,
    query_by: 'content',
    per_page: 3,
  }
  const result = await typesense.collections(COLLECTION_NAME).documents().search(searchParameters)
  // Construit le contexte à injecter dans le prompt
  const context = (result.hits ?? [])
    .map(
      (hit: any) =>
        `Module: ${hit.document.module}\nSection: ${hit.document.section}\n${hit.document.content}`
    )
    .join('\n---\n')
  return context
}

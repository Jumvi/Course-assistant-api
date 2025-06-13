import env from '#start/env'
import OpenAi from 'openai'
import { systemPrompt } from '../../utils/system_prompt.js'

const client = new OpenAi({
  apiKey: env.get('OPENAI_API_KEY'),
})

export default class OpenAiService {
  static async chatCompletion(prompt: string, context: string): Promise<string> {
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        { role: 'system', content: `Contexte : ${context}` },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
    })
    return response.choices[0]?.message?.content ?? 'Aucune réponse disponible pour cette requête.'
  }
}

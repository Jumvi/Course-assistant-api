import env from '#start/env'
import OpenAi from 'openai'

const client = new OpenAi({
  apiKey: env.get('OPENAI_API_KEY'),
})

export default class OpenAiService {
  static async chatCompletion(prompt: string): Promise<string> {
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Tu es un assistant pédagogique qui répond aux étudiants.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
    })
    return response.choices[0]?.message?.content ?? 'Aucune réponse disponible pour cette requête.'
  }
}

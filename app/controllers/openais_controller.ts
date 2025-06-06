import OpenAiService from '#services/openai_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class OpenaisController {
  async chat({ request, response }: HttpContext) {
    const prompt = request.input('prompt', '')
    if (!prompt) {
      return response.status(400).send({ error: 'Le prompt est requis.' })
    }

    try {
      const answer = await OpenAiService.chatCompletion(prompt)
      return response.json({ answer })
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse:', error)
      return response.status(500).send({ error: 'Erreur interne du serveur.' })
    }
  }
}

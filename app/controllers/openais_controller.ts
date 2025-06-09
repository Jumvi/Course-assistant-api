import { manageQuota } from '#services/quota_service'
import OpenAiService from '#services/openai_service'
import type { HttpContext } from '@adonisjs/core/http'
import { historyService } from '#services/history_service'

export default class OpenaisController {
  async chat({ request, response, auth }: HttpContext) {
    const data = request.only(['prompt'])
    const user = auth.user!
    if (!data.prompt) {
      return response.status(400).send({ error: 'Le prompt est requis.' })
    }
    try {
      // Vérification et gestion du quot

      await manageQuota(user.id)
      const answer = await OpenAiService.chatCompletion(data.prompt)
      await historyService(data.code, data.prompt, answer)

      return response.json({ answer })
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse:', error)
      return response.status(500).send({ error: 'Erreur interne du serveur.' })
    }
  }
}

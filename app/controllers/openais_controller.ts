import { manageQuota } from '#services/quota_service'
import OpenAiService from '#services/openai_service'
import type { HttpContext } from '@adonisjs/core/http'
import { historyService } from '#services/history_service'
import History from '#models/history'
import { getContextForQuestion } from '#services/context_service'

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
      const context = await getContextForQuestion(data.prompt)
      const answer = await OpenAiService.chatCompletion(data.prompt, context)
      await historyService(user.id, data.prompt, answer)

      const userChatHistory = await History.query()
        .where('user_id', user.id)
        .orderBy('created_at', 'asc')
        .limit(10)
      return response.json({ userChatHistory })
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse:', error)
      return response.status(500).send({ error: 'Erreur interne du serveur.' })
    }
  }
}

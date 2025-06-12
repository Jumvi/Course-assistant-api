import History from '#models/history'
import type { HttpContext } from '@adonisjs/core/http'

export default class HistoriesController {
  async getUserChatHistory({ response, auth }: HttpContext) {
    const user = auth.user!
    try {
      const userChatHistory = await History.query()
        .preload('user')
        .where('user_id', user.id)
        .orderBy('created_at', 'asc')
        .limit(20)

      return response.json({
        history: userChatHistory,
        message: 'Historique de chat récupéré avec succès.',
      })
    } catch (error) {
      console.error('Erreur lors de la récupération de l’historique de chat:', error)
      return response.status(500).send({
        error: 'Erreur interne du serveur lors de la récupération de l’historique de chat.',
      })
    }
  }

  async getAllHistory({ response }: HttpContext) {
    try {
      const allHistory = await History.query()
        .preload('user')
        .orderBy('created_at', 'asc')
        .limit(30)

      return response.json({
        history: allHistory,
        message: 'Historique de chat récupéré avec succès.',
      })
    } catch (error) {
      console.error('Erreur lors de la récupération de l’historique de chat:', error)
      return response.status(500).send({
        error: 'Erreur interne du serveur lors de la récupération de l’historique de chat.',
      })
    }
  }
}

import QuotaCode from '#models/quota_code'
import type { HttpContext } from '@adonisjs/core/http'

export default class QuotasController {
  async createNewQuota({ response, auth }: HttpContext) {
    //Génération d'un code aléatoire de 6 caractères à partir de la bibliothèque uuid

    try {
      const user = auth.user!
      const newQuotaCode = await QuotaCode.create({
        userId: user.id,
        quotaTotal: 10,
        evalaibleQuota: 10,
      })

      return response.status(201).json({
        message: 'Nouveau quota créé avec succès',
        quota: newQuotaCode,
      })
    } catch (error) {
      console.error('Erreur lors de la création du quota:', error)
      return response.status(500).json({
        error: 'Erreur interne du serveur lors de la création du quota.',
      })
    }
  }
}

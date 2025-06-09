import QuotaCode from '#models/quota_code'
import type { HttpContext } from '@adonisjs/core/http'
import { v4 as uuidv4 } from 'uuid'

export default class QuotasController {
  async createNewQuota({ response }: HttpContext) {
    //Génération d'un code aléatoire de 6 caractères à partir de la bibliothèque uuid

    try {
      const code = uuidv4().slice(0, 6).toUpperCase()
      const newQuotaCode = await QuotaCode.create({
        code,
        quotaTotal: 10,
        evalaibleQuota: 10,
      })

      return response.status(201).json({
        message: 'Nouveau quota créé avec succès',
        code: newQuotaCode.code,
      })
    } catch (error) {
      console.error('Erreur lors de la création du quota:', error)
      return response.status(500).json({
        error: 'Erreur interne du serveur lors de la création du quota.',
      })
    }
  }
}

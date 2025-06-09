import QuotaCode from '#models/quota_code'
import { DateTime } from 'luxon'

export const manageQuota = async (userId: number): Promise<void> => {
  try {
    // Cherche sans lever d'exception
    let quota = await QuotaCode.query().where('user_id', userId).first()

    // S’il n’existe pas, on le crée
    if (!quota) {
      quota = await QuotaCode.create({
        userId: userId,
        quotaTotal: 10,
        evalaibleQuota: 10,
        updatedAt: DateTime.now(),
      })
      quota.evalaibleQuota -= 1
      await quota.save()
    }

    const now = DateTime.now()

    // Si on a changé de jour, on réinitialise le quota
    if (!quota.updatedAt.hasSame(now, 'day')) {
      quota.evalaibleQuota = quota.quotaTotal
      quota.updatedAt = now
      await quota.save()
    }

    // Si plus de quota dispo
    if (quota.evalaibleQuota <= 0) {
      throw new Error('Vous avez atteint la limite de requêtes journalières')
    }

    // Sinon, décrémenter le quota
    quota.evalaibleQuota -= 1
    await quota.save()
  } catch (error) {
    console.error('Erreur lors de la gestion du quota:', error)
    throw error // Ne le retransforme pas ici, tu peux attraper dans ton controller
  }
}

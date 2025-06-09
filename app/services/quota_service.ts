import QuotaCode from '#models/quota_code'
import { DateTime } from 'luxon'

export const manageQuota = async (userId: number): Promise<void> => {
  try {
    const quota = await QuotaCode.query().where('user_id', userId).firstOrFail()
    const now = DateTime.now()
    if (!quota.updatedAt.hasSame(now, 'day')) {
      quota.evalaibleQuota = quota.quotaTotal
      quota.updatedAt = now
      await quota.save()
    }

    if (quota.evalaibleQuota <= 0) {
      throw new Error('Quota épuisé')
    }
    quota.evalaibleQuota -= 1
    await quota.save()
  } catch (error) {
    if (error.code === 'E_ROW_NOT_FOUND') {
      throw new Error('Code de quota invalide ou inexistant')
    } else if (error.message === 'Quota épuisé') {
      throw new Error('Vous avez atteint la limite de reqêtes journalières')
    } else {
      console.error('Erreur lors de la gestion du quota:', error)
      throw new Error('Erreur interne du serveur lors de la gestion du quota.')
    }
  }
}

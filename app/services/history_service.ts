import History from '#models/history'
import QuotaCode from '#models/quota_code'

export const historyService = async (
  userId: number,
  prompt: string,
  answer?: string
): Promise<void> => {
  try {
    const quota = await QuotaCode.query().where('user_id', userId).firstOrFail()
    const newHistory = await History.create({
      quotaCodeId: quota.id,
      prompt: prompt,
      answer: answer || undefined,
    })
    await quota.related('histories').save(newHistory)
  } catch (error) {
    if (error.code === 'E_ROW_NOT_FOUND') {
      throw new Error('Code de quota invalide ou inexistant')
    } else {
      console.error("Erreur lors de la création de l'historique:", error)
      throw new Error("Erreur interne du serveur lors de la création de l'historique.")
    }
  }
}

import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import QuotaCode from './quota_code.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class History extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare quotaCodeId: number

  @column()
  declare prompt: string
  @column()
  declare answer: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => QuotaCode)
  declare quotaCode: BelongsTo<typeof QuotaCode>
}

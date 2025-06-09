import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import History from './history.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class QuotaCode extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare quotaTotal: number

  @column()
  declare evalaibleQuota: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => History)
  declare histories: HasMany<typeof History>
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class DropUniqueUserIdOnHistories extends BaseSchema {
  protected tableName = 'histories'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Supprimer la contrainte unique sur user_id
      table.dropUnique(['user_id'])
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Remettre la contrainte unique sur user_id
      table.unique(['user_id'])
    })
  }
}

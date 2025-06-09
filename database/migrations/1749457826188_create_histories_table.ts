import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'histories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('quota_code_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('quota_codes')
        .onDelete('CASCADE')

      table.text('prompt').notNullable()
      table.text('answer').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import Knex from "knex";

export async function up(knex: Knex) {
  //Criar TABELA
  return knex.schema.createTable("items", (table) => {
    table.increments("id").primary();
    table.string("image").notNullable();
    table.string("title").notNullable();
  });
}

export async function down(knex: Knex) {
  //Deve ser utilizado para voltar a atras ( DELETAR TABELA)
  return knex.schema.dropTable("items");
}

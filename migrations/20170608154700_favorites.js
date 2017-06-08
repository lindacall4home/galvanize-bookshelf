
exports.up = function(knex, Promise) {
  return knex.schema.createTable("favorites", function(table){
    table.increments();
    table.integer("book_id").notNullable();
    table.foreign('book_id').references('books.id').onDelete('cascade');
    table.integer("user_id").notNullable();
    table.foreign("user_id").references('users.id').onDelete('cascade');
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};

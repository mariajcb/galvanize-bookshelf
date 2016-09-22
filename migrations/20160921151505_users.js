'use strict';

//migrate: latest
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments();//PK defaults to id
    table.string('first_name').notNullable().defaultTo('');
    table.string('last_name').notNullable().defaultTo('');
    table.string('email').notNullable().defaultTo('');
    table.specificType('hashed_password', 'char(60)').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  })
};

//migrate:rollback
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};

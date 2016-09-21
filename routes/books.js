'use strict';
const express = require('express');
const knex = require('../knex');
const router = express.Router();
const humps = require('humps');

router.get('/', (req, res) => {
  knex('books')
        .orderBy('title')
        .then((books) => {
          res.json(humps.camelizeKeys(books));
        });
});

router.get('/:id', (req, res) => {
    knex('books')
        .where('books.id', req.params.id)
        .first()
        .then((book) => {
          res.json(humps.camelizeKeys(book));
        });
});

router.post('/', (req, res) => {
  knex('books')
    .returning(['id', 'title', 'author', 'genre', 'description', 'cover_url'])
    .insert({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl
    }).then((book) => {
      res.json(humps.camelizeKeys(book[0]));
    });
});

router.patch('/:id', (req, res) => {
  knex('books')
    .where('id', req.params.id)
    .returning(['id', 'title', 'author', 'genre', 'description', 'cover_url'])
    .update({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl
    }).then((book) => {
      res.json(humps.camelizeKeys(book[0]));
    });
});

router.delete('/:id', (req, res) => {
  knex('books')
    .returning(['title', 'author', 'genre', 'description', 'cover_url'])
    .where('books.id', req.params.id)
    .del()
    .then((book) => {
      res.json(humps.camelizeKeys(book[0]));
    });
});

module.exports = router;

'use strict'

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');
const boom = require('boom');
const humps = require('humps');
const cookieSession = require('cookie-session');

const authorize = function(req, res, next){
  if(!req.session.userId) {
    return next(boom.create(401, 'Unauthorized'));
  }
  next();
}

router.get('/', authorize, function(req, res, next) {
  knex('favorites')
  .innerJoin('books', 'favorites.book_id', 'books.id')
  .where('favorites.user_id', 1)
  .then((results) => {
    let favorites = humps.camelizeKeys(results);
    res.json(favorites);
  })
  .catch((err) => {
  next(err);
});
});


router.get('/:id', authorize, function(req, res, next) {
  knex('favorites')
  .where('book_id', req.query.bookId)
  .then((favorites) => {
    if (favorites.length === 0) {
      res.send(false);
    } else {
      res.send(true);
    }
  })
  .catch((err) => {
  next(err);
});
});


router.post('/', authorize, (req, res, next) => {
  knex('favorites')
    .returning(['id', 'book_id', 'user_id'])
    .insert({
      'user_id': 1,
      'book_id': req.body.bookId
    })
    .then((favorite) => {
        res.send(humps.camelizeKeys(favorite[0]));
    })
    .catch((err) => {
    next(err);
  });
});


router.delete('/', authorize, (req, res, next) => {
  knex('favorites')
  .returning(['book_id', 'user_id'])
  .where('book_id', req.body.bookId)
  .del()
  .then((favorite) => {
    res.json(humps.camelizeKeys(favorite[0]));
  })
.catch((err) => {
    next(err);
  });
});


module.exports = router;

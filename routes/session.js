'use strict'

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');
const boom = require('boom');
const humps = require('humps');

router.get('/', function(req, res, next) {
  if (req.session.userId) {
    res.send(true)
  } else {
    res.send(false)
  }
})

router.post('/', function(req, res, next) {
  knex('users')
  .where('email', req.body.email)
  .first()
  .then(function(results) {
    if (!results) {
      throw boom.create(400, 'Bad email or password')
        } else {
        var user = results
            var passwordMatch = bcrypt.compareSync(req.body.password, user.hashed_password)
            if (passwordMatch === false) {
                throw boom.create(400, 'Bad email or password')
            } else {
              delete user.hashed_password
              req.session.userId = user
              res.send(humps.camelizeKeys(user))
            }
    }
  })
  .catch((err) => {
    next(err);
  })
});

router.delete('/', (req, res) => {
  req.session = null;
  res.send(true);
});

module.exports = router;

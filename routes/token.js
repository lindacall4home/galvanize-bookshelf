'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const bcrypt = require('bcrypt');
const humps = require('humps');


router.get('/token', function (req,res,next) {
  res.setHeader('Content-Type', 'application/json');
  if (req.user) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});

router.post('/token', function (req,res,next) {
  let body = req.body;

  knex('users')
  .select()
  .where('email', body.email)
  .then(function(users){
    if(users.length === 0){
      res.setHeader('Content-Type', 'text/plain');
      return res.status(400).send('Bad email or password');
    }
    bcrypt.compare(body.password, users[0].hashed_password, function(err, result) {
      if(result === true){
        var retUser = humps.camelizeKeys(users[0]);
        delete retUser.hashedPassword;
        let payload = Object.assign({}, retUser);
        res.cookie('token',jwt.sign(payload, process.env.JWT_SECRET), { httpOnly: true });
        return res.send(retUser);
      }
      else{
        res.setHeader('Content-Type', 'text/plain');
        return res.status(400).send('Bad email or password');
      }
    });
  });
});

router.delete('/token', function (req,res,next) {
  res.setHeader('Content-Type', 'application/json');
  res.cookie('token', '');
  res.send(true);
});

module.exports = router;

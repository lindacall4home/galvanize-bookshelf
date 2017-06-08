'use strict';

const express = require('express');
const humps = require('humps');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

// eslint-disable-next-line new-cap
const router = express.Router();
var knex = require('../knex');

router.post('/users', function(req,res,next){
  var newUser = humps.decamelizeKeys(req.body);

  if (!newUser.email) {
    res.setHeader('Content-Type', 'text/plain');
    return res.status(400).send('Email must not be blank');
  }

  if (!newUser.password || newUser.password.length < 8) {
    res.setHeader('Content-Type', 'text/plain');
    return res.status(400).send('Password must be at least 8 characters long');
  }

  if (!newUser.password || newUser.password.length < 8) {
    res.setHeader('Content-Type', 'text/plain');
    return res.status(400).send('Password must be at least 8 characters long');
  }

  knex('users')
  .select('id')
  .where('email', newUser.email)
  .then(function(data){
    if(data.length > 0){
    res.setHeader('Content-Type', 'text/plain');
    return res.status(400).send('Email already exists');
    }
  });


  bcrypt.hash(newUser.password, 10, function(err, hash) {
    if(err){
      console.log(err);
    }
    newUser.hashed_password = hash;
    delete newUser.password;
    knex('users')
    .insert(newUser, '*' )
    .then(function(data){
      var insertedUser = humps.camelizeKeys(data[0]);
      delete insertedUser.hashedPassword;
      return res.send(insertedUser);
    });
  });
});


module.exports = router;

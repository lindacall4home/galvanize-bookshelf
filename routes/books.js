'use strict';

const express = require('express');
const humps = require('humps');
const bodyParser = require('body-parser');

// eslint-disable-next-line new-cap
const router = express.Router();
var knex = require('../knex');

// YOUR CODE HERE
router.get('/books', (req, res, next)=>{
  knex('books')
  .orderBy('title')
  .then((data)=>{
    let formattedData = data.map((obj)=>{
      return humps.camelizeKeys(obj);
    });
    res.send(formattedData);
  });
});

router.get('/books/:id', function(req,res,next){
  knex('books')
  .where('id', req.params.id)
  .then(function(data){
    res.send(humps.camelizeKeys(data[0]));
  });
});

router.post('/books', function(req,res,next){
  knex('books')
  .insert(humps.decamelizeKeys(req.body), '*' )
  .then(function(data){
    res.send(humps.camelizeKeys(data[0]));
  });
});

router.patch('/books/:id', function(req,res,next){
  knex('books')
  .where('id', req.params.id)
  .update(humps.decamelizeKeys(req.body), '*')
  .then(function(data){
    res.send(humps.camelizeKeys(data[0]));
  });
});

router.delete('/books/:id', function(req,res,next){
  knex('books')
  .select('title', 'author', 'genre', 'description', 'cover_url')
  .where('id', req.params.id)
  .then(function(data){
    knex('books')
    .where('id', req.params.id)
    .del()
    .then(function(numRecords){
      res.send(humps.camelizeKeys(data[0]));
    });
  });
});

module.exports = router;

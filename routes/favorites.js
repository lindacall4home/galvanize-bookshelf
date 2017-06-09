'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');
const bodyParser = require('body-parser');


router.get('/favorites', (req, res, next)=>{
  if(!req.user){
    res.setHeader('Content-Type', 'text/plain');
    return res.status(401).send('Unauthorized');
  }
  knex('favorites')
  .innerJoin('books', 'favorites.book_id', 'books.id')
  .where('user_id', req.user.id)
  .then((data)=>{
    let formattedData = data.map((obj)=>{
      return humps.camelizeKeys(obj);
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(formattedData);
  });
});

router.get('/favorites/check', function(req,res,next){
  if(!req.user){
    res.setHeader('Content-Type', 'text/plain');
    return res.status(401).send('Unauthorized');
  }
  knex('favorites')
  .select('id')
  .where('user_id', req.user.id)
  .andWhere('book_id', req.query.bookId)
  .then((data)=>{
    res.setHeader('Content-Type', 'application/json');
    if(data.length > 0){
      return res.send('true');
    }
    return res.send('false');
  });
});

router.post('/favorites', function(req,res,next){
  if(!req.user){
    res.setHeader('Content-Type', 'text/plain');
    return res.status(401).send('Unauthorized');
  }
  knex('favorites')
  .insert({user_id: req.user.id, book_id: req.body.bookId}, '*' )
  .then(function(data){
    res.setHeader('Content-Type', 'application/json');
    res.send(humps.camelizeKeys(data[0]));
  });
});


router.delete('/favorites', function(req,res,next){
  if(!req.user){
    res.setHeader('Content-Type', 'text/plain');
    return res.status(401).send('Unauthorized');
  }
  knex('favorites')
  .where('user_id', req.user.id)
  .andWhere('book_id', req.body.bookId)
  .then(function(data){
    knex('favorites')
    .where('id', data[0].id)
    .del()
    .then(function(numRecords){
      delete data[0].id;
      res.setHeader('Content-Type', 'application/json');
      res.send(humps.camelizeKeys(data[0]));
    });
  });
});


module.exports = router;

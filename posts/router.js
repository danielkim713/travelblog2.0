'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const {Posts} = require('./models');

const config = require('../config');
const router = express.Router();
router.use(bodyParser.json());

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/', jwtAuth, (req, res) => {

  let country = req.body.country;
  let username = req.body.username;
  let content = req.body.content;

  return Posts.create({
  	country: country,
  	content: content,
  	username: username
  })
  .then(() => {
  	return res.status(200).json({message: 'created'});
  }).catch(err => {
  	return res.status(500);
  });
});


router.get('/:country', jwtAuth, (req, res) => {
	let country = req.params.country;

	Posts.find({ country: country })
		.then(posts => {
			console.log(posts);

			let responseArray = [];
			posts.forEach(post => {
				responseArray.push({
					username: post.username,
					content: post.content
				});
			});
			console.log(responseArray);
			return res.status(200).json(responseArray);
		}).catch(err => {
			return res.status(500);
		});
});

module.exports = {router};

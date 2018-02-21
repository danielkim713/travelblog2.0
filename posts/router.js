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
  const authToken = createAuthToken(req.user);
  res.json({authToken});
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

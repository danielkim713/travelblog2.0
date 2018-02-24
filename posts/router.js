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

// router.post('/', jsonParser, (req,res) => {
// 	const requiredFields = ['username', 'content', 'country'];
// 	const missingField = requiredField.find(field => !(fiend in req.body));

// 	if (missingField) {
// 		return res.status(422).json({
// 			code: 422;
// 			reason: 'CompletionError',
// 			message: 'Missing field', 
// 			lcation: missingField
// 		});
// 	}

// 	const stringField = ['username', 'content', 'country'];
// 	const nonStringField = stringFields.find(
// 		field => field in req.body && typeof req.body[field] !== 'string'
// 	);

// 	if (nonStringField) {
// 		return res.status(422).json({
// 			code: 422,
// 			reason: 'CompletionError',
// 			message: 'Incorrect field type: expected string',
// 			location: nonStringField
// 		});
// 	}

// 	const sizedFields = {
// 		content: {
// 			min: 1
// 		}
// 	};

// 	const tooSmallField = Object.keys(sizedFields).find(
// 		field =>
//       		'min' in sizedFields[field] &&
//             	req.body[field].trim().length < sizedFields[field].min
//   	);

//   	if tooSmallField {
//   		return res.status(422).json({
//   			code: 422, 
//   			reason: 'ValidationError',
//   			message: tooSmallField
//   				?`Must be at least ${sizedFields[tooSmallField]
//           		.min} characters long`,
//           	location: tooSmallField
//   		});
//   	}

//   	let {username, content, country} = req.body;

//   	return Users

//});

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

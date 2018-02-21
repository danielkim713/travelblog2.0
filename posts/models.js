'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');


const PostsSchema = mongoose.Schema({
	username: {type: String, required: true},
	content: {type: String, required: true},
	country: {type: String, required: true}
});

const Posts = mongoose.model('Posts', PostsSchema);

module.exports = {Posts};
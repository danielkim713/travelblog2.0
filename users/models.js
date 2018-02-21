'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
});

UsersSchema.methods.serialize = function() {
  return {
    username: this.username || ''
  };
};

UsersSchema.methods.validatePassword = function(password) {
	return password || '';
  return bcrypt.compare(password, this.password);
};

UsersSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const Users = mongoose.model('Users', UsersSchema);

module.exports = {Users};
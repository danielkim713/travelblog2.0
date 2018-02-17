const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  posts: {type: Array}
});

const Users = mongoose.model('Users', UsersSchema);

module.exports = {Users};
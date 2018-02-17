'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./.config');
const {Users} = require('./model/user');

const jsonParser = bodyParser.json();

app.use(express.static('public'));

/**
* POST to /user creates new username and password
* Username must not be taken
* @param {object} user - username and password
* {
*   username: new username,
*   password: new password
* }
* @return {string} response - response description
*/

//change get to post
app.post('/users', jsonParser, function (req, res) {
    // if (!req.body) {
 //        return res.status(400).json({
 //            message: "No request body"
 //        });
 //    }
 //    if (!('username' in req.body)) {
 //        return res.status(422).json({
 //            message: 'Missing field: username'
 //        });
 //    }
 //    let username = req.body.username;
 //    if (typeof username !== 'string') {
 //        return res.status(422).json({
 //            message: 'Incorrect field type: username'
 //        });
 //    }
 //    username = username.trim();
 //    if (username === '') {
 //        return res.status(422).json({
 //            message: 'Incorrect field length: username'
 //        });
 //    }
 //https://github.com/phc5/medication-reminder/blob/master/server/index.js

    Users
        .find()
        .then(user => {
            res.json({
                user: user.map((user) => user)
            });
        })
        .catch(
            err => {
                console.log(err)
        });
});

//get posts everytime they click a country
app.get('/posts', jsonParser, function (req, res) {
    if (!req.body) {
        //send error
    }
    //if (!('username' in req.body)) {
 //        return res.status(422).json({
 //            message: 'Missing field: username'
 //        });
 //    }
 //    let username = req.body.username;
 // do this for password ^ chcek and then set password.
 // let password = req.body.password


    //find posts based on country.
    // User Schema: {
    //  username: string
    //  password: string
    //  posts: [
    //    {
    //      content: string,
    //      country: string
    //    },
    //    {
    //      content: string,
    //      country: string
    //    },
    //    ...
    //  ]
    // }
    Users
        .create({
            username: username,
            password: password
        }, function (err, user) {
            if (err) {
                //didnt work
            }
            res.status(201)
        })
        // .then(posts => {
  //        res.json({
  //            user: posts.username
  //        })
  //        })
  //        .catch(
  //            err => {
  //                console.log(err)
  //            })
});


//post comment when they submit post
app.post('/post', jsonParser, function (req, res) {
    
});

let server;

function runServer(databaseUrl, port=PORT) {
    return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer };
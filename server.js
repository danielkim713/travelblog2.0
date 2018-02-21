'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

// Here we use destructuring assignment with renaming so the two variables
// called router (from ./users and ./auth) have different names
// For example:
// const actorSurnames = { james: "Stewart", robert: "De Niro" };
// const { james: jimmy, robert: bobby } = actorSurnames;
// console.log(jimmy); // Stewart - the variable name is jimmy, not james
// console.log(bobby); // De Niro - the variable name is bobby, not robert
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: postsRouter } = require('./posts');


mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');

const app = express();
app.use(express.static('public'));

// Logging
app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/posts/', postsRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
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
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };


// 'use strict';

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const passport = require('passport');
// const app = express();
// app.post('/users', jsonParser, function (req, res) {
//   const requiredFields = ['username', 'password'];
//   const missingField = requiredFields.find(field => !(field in req.body));

//   if (missingField) {
//     return res.status(422).json({
//       code: 422,
//       reason: 'ValidationError',
//       message: 'Missing field',
//       location: missingField
//     });
//   }

//   const stringFields = ['username', 'password'];
//   const nonStringField = stringFields.find(
//     field => field in req.body && typeof req.body[field] !== 'string'
//   );

//   if (nonStringField) {
//     return res.status(422).json({
//       code: 422,
//       reason: 'ValidationError',
//       message: 'Incorrect field type: expected string',
//       location: nonStringField
//     });
//   }

//   // If the username and password aren't trimmed we give an error.  Users might
//   // expect that these will work without trimming (i.e. they want the password
//   // "foobar ", including the space at the end).  We need to reject such values
//   // explicitly so the users know what's happening, rather than silently
//   // trimming them and expecting the user to understand.
//   // We'll silently trim the other fields, because they aren't credentials used
//   // to log in, so it's less of a problem.
//   const explicityTrimmedFields = ['username', 'password'];
//   const nonTrimmedField = explicityTrimmedFields.find(
//     field => req.body[field].trim() !== req.body[field]
//   );

//   if (nonTrimmedField) {
//     return res.status(422).json({
//       code: 422,
//       reason: 'ValidationError',
//       message: 'Cannot start or end with whitespace',
//       location: nonTrimmedField
//     });
//   }

//   const sizedFields = {
//     username: {
//       min: 1
//     },
//     password: {
//       min: 5,
//       // bcrypt truncates after 72 characters, so let's not give the illusion
//       // of security by storing extra (unused) info
//       max: 72
//     }
//   };
//   const tooSmallField = Object.keys(sizedFields).find(
//     field =>
//       'min' in sizedFields[field] &&
//             req.body[field].trim().length < sizedFields[field].min
//   );
//   const tooLargeField = Object.keys(sizedFields).find(
//     field =>
//       'max' in sizedFields[field] &&
//             req.body[field].trim().length > sizedFields[field].max
//   );

//   if (tooSmallField || tooLargeField) {
//     return res.status(422).json({
//       code: 422,
//       reason: 'ValidationError',
//       message: tooSmallField
//         ? `Must be at least ${sizedFields[tooSmallField]
//           .min} characters long`
//         : `Must be at most ${sizedFields[tooLargeField]
//           .max} characters long`,
//       location: tooSmallField || tooLargeField
//     });
//   }

//   let {username, password} = req.body;

//   return Users.find({username})
//     .count()
//     .then(count => {
//       if (count > 0) {
//         // There is an existing user with the same username
//         return Promise.reject({
//           code: 422,
//           reason: 'ValidationError',
//           message: 'Username already taken',
//           location: 'username'
//         });
//       }
//       // If there is no existing user, hash the password
//       return Users.hashPassword(password);
//     })
//     .then(hash => {
//       return Users.create({
//         username,
//         password: hash
//       });
//     })
//     .then(user => {
//       return res.status(201).json(user.serialize());
//     })
//     .catch(err => {
//       // Forward validation errors on to the client, otherwise give a 500
//       // error because something unexpected has happened
//       if (err.reason === 'ValidationError') {
//         return res.status(err.code).json(err);
//       }
//       res.status(500).json({code: 500, message: 'Internal server error'});
//     });
// });

// //get posts everytime they click a country
// app.get('/posts', jsonParser, function (req, res) {
//     if (!req.body) {
//         //send error
//     }
//     //if (!('username' in req.body)) {
//  //        return res.status(422).json({
//  //            message: 'Missing field: username'
//  //        });
//  //    }
//  //    let username = req.body.username;
//  // do this for password ^ chcek and then set password.
//  // let password = req.body.password


//     Users
//         .create({
//             username: username,
//             password: password
//         }, function (err, user) {
//             if (err) {
//                 //didnt work
//             }
//             res.status(201)
//         })
//         // .then(posts => {
//   //        res.json({
//   //            user: posts.username
//   //        })
//   //        })
//   //        .catch(
//   //            err => {
//   //                console.log(err)
//   //            })
// });


// //post comment when they submit post
// app.post('/post', jsonParser, function (req, res) {
    
// });

// let server;

// function runServer(databaseUrl, port=PORT) {
//     return new Promise((resolve, reject) => {
//     mongoose.connect(databaseUrl, err => {
//       if (err) {
//         return reject(err);
//       }

//       server = app.listen(port, () => {
//         console.log(`Your app is listening on port ${port}`);
//         resolve();
//       })
//       .on('error', err => {
//         mongoose.disconnect();
//         reject(err);
//       });
//     });
//   });
// }

// function closeServer() {
//     return new Promise((resolve, reject) => {
//       console.log('Closing server');
//       server.close(err => {
//         if (err) {
//           return reject(err);
//         }
//         resolve();
//       });
//     });
// }

// if (require.main === module) {
//     runServer(DATABASE_URL).catch(err => console.error(err));
// };

// module.exports = { app, runServer, closeServer };
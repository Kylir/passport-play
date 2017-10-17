
'use strict'

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const debug = require('debug')('index')
const utils = require('./lib/utils')

const app = express()

// Hardcoded password store - obviously nobody would use this, right?!
const usersDatabase = [
  {username: 'jason', password: 'pass01', id: 1 },
  {username: 'bla', password: 'pass02', id: 2 },
  {username: 'bleh', password: 'pass03', id: 3 }
]

// Middleware party!
app.use(express.static('public'))
app.use(session({
  secret: 'A good key should be placed here...',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())

// ************** Strategy definition ***************

// Function used by the Local Strategy to authenticate a given set of credentials
const strategy = (username, password, done) => {
  debug('Verification function. Received: username: ' + username + ' and password: ' + password)

  let user = utils.findUserByName(username, usersDatabase)
  
  if (!user) {
    debug('Username not found in the store.')
    return done(null, false, { message: 'Incorrect username.' })
  }

  if (user.password !== password) {
    debug('Username found in the store but wrong password.')
    return done(null, false, { message: 'Incorrect password.' })
  }

  //All good!
  debug('Username found and correct password.')
  return done(null, {username: username, password: password, id: 'harcoded'})
}

// Configure passport to use the above strategy
passport.use(new LocalStrategy(strategy))


// ************** Session management ***************
passport.serializeUser(function(user, done) {
  debug('Serialize user called.')
  done(null, user.id)
});

passport.deserializeUser(function(id, done) {
  let err

  debug('Deserialize user called.')
  
  let user = utils.findUserById(id)
  if (!user) {
    err = new Error('Impossible to find user with id: ' + id)
  }
  done(err, user)

});

// ************** Routes ***************

app.post('/login',
  passport.authenticate('local', {failureRedirect: '/login'}),
  (req, res) => {res.json({'msg': 'Auth is successful'})}
)

app.get('/',
  (req, res) => {res.json({'msg': 'Hello World!'})}
)

// Start the server
app.listen(3000, function () {
  console.log('Passport-play is listening on port 3000.')
}) 

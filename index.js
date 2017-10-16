
'use strict'

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const app = express()

// Middleware party!
app.use(express.static('public'))
app.use(session({
  secret: 'I never found any good key...',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())

// Configure passport
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err) }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' })
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' })
      }
      return done(null, user)
    })
  }
))

//The routes
app.get('/secret', passport.authenticate('local'), function(req, res) {
  res.send('This is a restricted area. Well done if you can read this!')
})

app.get('/', function (req, res) {
  res.send('Hello World!')
})

// Start the server
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
}) 

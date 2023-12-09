const express = require('express')
const {signup, authenticateUser, signin, signout} = require('../controller/user')
const router = express.Router()
const {check} = require('express-validator')


router.post('/signup',  [
  check("name", "Name atleast should be 3 characters").isLength({min: 3}),
  check("email", "Email should be valid").isEmail(),
  check("password", "Password at least should be 6 characters").isLength({min: 6}),
] ,signup)

router.post('/login', [
  check("email", "Email should be valid").isEmail(),
  check("password", "Password at least should be 6 characters").isLength({min: 6}),
], signin)


router.get('/signout', signout)

module.exports = router

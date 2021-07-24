const express = require('express')
const userControllers = require('../controllers/users.controller')

const router = express.Router()

router.post('/sign-up', userControllers.userSignUp)
router.post('/login', userControllers.userLogin)

module.exports = router
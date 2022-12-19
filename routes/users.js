const User = require('../models/User')
const express = require('express')
const usersController = require('../controllers/usersController')
const router = express.Router()


router.route('/').post(usersController.createUser)


module.exports = router
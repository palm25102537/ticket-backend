const express = require('express')
const router = express.Router()
const UserControl = require('../controller/UserController')
const authen = require('../middleware/authen')

router.get('/', authen, UserControl.getMe)
router.get('/:id', UserControl.getUser)
router.post('/register', UserControl.register)
router.post('/login', UserControl.login)
router.put('/edit', authen, UserControl.editAccount)

module.exports = router
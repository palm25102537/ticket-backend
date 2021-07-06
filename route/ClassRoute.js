const express = require('express')
const router = express.Router()
const ClassControl = require('../controller/ClassController')
const authen = require('../middleware/authen')
router.get('/', ClassControl.getClass)
router.post('/create', authen, ClassControl.createClass)

module.exports = router
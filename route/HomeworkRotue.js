const express = require('express')
const router = express.Router()
const HomeworkControl = require('../controller/HomeworkController')
const authen = require('../middleware/authen')

router.get('/', HomeworkControl.getHomework)
router.post('/create', authen, HomeworkControl.createHomework)
router.put('/edit/:id', authen, HomeworkControl.editHomework)

module.exports = router
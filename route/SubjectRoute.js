const express = require('express')
const router = express.Router()
const SubjectControl = require('../controller/SubjectController')

router.get('/', SubjectControl.getAllSubject)
router.post('/create', SubjectControl.createSubject)
router.put('/edit/:id', SubjectControl.editSubject)
module.exports = router
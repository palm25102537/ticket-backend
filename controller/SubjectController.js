const { Subject, sequelize } = require('../models')
const Validate = require('../middleware/validateError')


async function createSubject(req, res, next) {
  const transaction = await sequelize.transaction()
  try {
    const { name } = req.body
    if (name.trim() === '') throw new Validate('Subject name cannot be blank', 400)
    const sendData = {
      name,
      status: 'Active'
    }
    await Subject.create(sendData, { transaction })

    await transaction.commit()

    res.status(201).json({ message: `Created ${name} subject` })

  } catch (err) {
    await transaction.rollback()
    next(err)
  }

}
async function getAllSubject(req, res, next) {
  try {
    const { id, order, desc } = req.query
    let searchCondition = {}

    if (id) {
      subject = await Subject.findOne({ where: { id } })
    }

    if (order) {
      searchCondition = { order: [[`${order}`, desc ? 'DESC' : 'ASC']] }
    }

    let subject = await Subject.findAll(searchCondition)

    return res.status(200).json({ subject })


  } catch (err) {
    next(err)
  }

}
async function editSubject(req, res, next) {
  try {
    const { name, status } = req.body
    const { id } = req.params

    if (name.trim() === '') throw new Validate('Subject name cannot be blank', 400)

    const subjectBeforeUpdate = await Subject.findOne({ where: { id } })
    if (!subjectBeforeUpdate) throw new Validate('Cannot find this subject', 400)

    const sendData = {
      name: name || subjectBeforeUpdate.name,
      status: status || subjectBeforeUpdate.status
    }
    await Subject.update(sendData, { where: { id } })
    res.status(200).json({ message: 'Updated' })
  } catch (err) {
    next(err)
  }
}
module.exports = {
  createSubject,
  getAllSubject,
  editSubject

}
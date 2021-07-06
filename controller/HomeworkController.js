const { Homework, sequelize, Subject, User } = require('../models')
const Validate = require('../middleware/validateError')


async function createHomework(req, res, next) {

  const transaction = await sequelize.transaction()
  try {
    const { id, role } = req.user
    const { title, description, subjectId, forClassId } = req.body

    if (role !== 'Teacher') throw new Validate('Only Teacher can create homework', 400)
    if (forClassId === '1' || forClassId == 1) throw new Validate('Cannot give homework to teacher', 400)

    const subject = await Subject.findOne({ where: { id: subjectId } })
    console.log(subject)
    const sendData = {
      title,
      description,
      subjectId,
      userId: id,
      status: 'pending',
      forClassId
    }

    await Homework.create(sendData, { transaction })

    await transaction.commit()

    res.status(200).json({ message: `Created homework ${subject.name} ${title} ${description}` })

  } catch (err) {
    await transaction.rollback()
    next(err)
  }

}

async function editHomework(req, res, next) {
  try {
    const { role } = req.user
    const { id } = req.params
    const { title, description, subjectId, status, forClassId } = req.body

    const homeworkBeforeUpdate = Homework.findOne({ where: { id } })
    if (!homeworkBeforeUpdate) throw new Validate('Cannot found this homework', 400)
    if (forClassId === '1' || forClassId == 1) throw new Validate('Cannot give homework to teacher', 400)
    const sendData = {
      title: role === 'Teacher' ? title : title === undefined || null || "" ? homeworkBeforeUpdate.title : title,
      description: role === 'Teacher' ? description : description === undefined || null || "" ? homeworkBeforeUpdate.description : description,
      subjectId: role === 'Teacher' ? subjectId : subjectId === undefined || null || "" ? homeworkBeforeUpdate.subjectId : subjectId,
      status: status || homeworkBeforeUpdate.status,
      forClassId: forClassId || homeworkBeforeUpdate.forClassId
    }

    await Homework.update(sendData, { where: { id } })

    res.status(200).json({ message: 'Updated' })
  } catch (err) {
    next(err)
  }


}
async function getHomework(req, res, next) {
  try {
    const { id, order, desc } = req.query
    let searchCondition = { include: [{ model: User, attributes: ['name'] }, { model: Subject, attributes: ['name'] }] }

    if (id) {
      searchCondition.where = { id }
      homework = await Homework.findOne(searchCondition)
    }

    if (order) {
      searchCondition.order = [[`${order}`, desc ? 'DESC' : 'ASC']]
    }
    let homework = await Homework.findAll(searchCondition)
    res.status(200).json({ homework })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createHomework,
  editHomework,
  getHomework
}
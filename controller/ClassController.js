const { Class, sequelize } = require('../models')
const Validate = require('../middleware/validateError')

async function createClass(req, res, next) {
  const transaction = await sequelize.transaction()
  try {
    const { name } = req.body
    if (name.trim() === '') throw new Validate('Class cannot be blank', 400)
    if (!name) throw new Validate('Class is required', 400)
    await Class.create({ name }, { transaction })
    res.status(200).json({ message: `Created ${name}` })
    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    next(err)
  }

}
async function getClass(req, res, next) {
  try {
    const { id, order, desc } = req.query
    let searchCondition = {}
    if (id) {
      searchCondition.where = { id }
      classes = await Class.findOne(searchCondition)
    }
    if (order) {
      searchCondition.order = [[`${order}`, desc ? "DESC" : "ASC"]]
    }
    let classes = await Class.findAll(searchCondition)
    res.status(200).json({ classes })

  } catch (err) {
    next(err)
  }
}

module.exports = {
  createClass,
  getClass
}
const { User } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = process.env

async function authen(req, res, next) {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.header.authorization.split(' ')[1]
    }
    const payload = jwt.verify(token, SECRET_KEY)
    const data = await User.findOne({ where: { id: payload.id } })
    if (!data) return res.status(400).json({ message: 'This user is not found' })
    req.user = data
    next();
  } catch (err) {
    next(err)
  }
}
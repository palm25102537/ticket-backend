const { User, sequelize } = require('../models')
const Validate = require('../middleware/validateError')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { SECRET_KEY, EXPIRE, SALT_ROUND } = process.env


async function register(req, res, next) {
  const transaction = await sequelize.transaction()
  try {
    const { name, username, password, confirmPassword, email, role } = req.body

    const isEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    const isPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

    if (!name) throw new Validate('Your name is required', 400)
    if (!username) throw new Validate('Username is required', 400)
    if (!password) throw new Validate('Password is required', 400)
    if (!email) throw new Validate('Your email id required', 400)
    if (!isEmail.test(email)) throw new Validate('Please check you email', 400)
    if (!isPassword.test(password)) throw new Validate(`Password must has minimum eight characters and at least one upper case English letter, one lower case English letter, one number and one special character`, 400)
    if (password !== confirmPassword) throw new Validate('Password and confirm password must be matched', 400)

    if (name.trim() === '') throw new Validate('Your name cannot be blank', 400)
    if (username.trim() === '') throw new Validate('Username cannot be blank', 400)

    const hashPassword = await bcrypt.hash(password, parseInt(SALT_ROUND))
    const sendData = {
      name,
      username,
      password: hashPassword,
      email,
      role,
      status: 'User',
      accountStatus: 'Active'
    }

    await User.create(sendData, { transaction })
    await transaction.commit()

    res.status(201).json({ message: `Created new ${role}` })

  } catch (err) {

    await transaction.rollback()
    next(err)

  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body
    if (!username) throw new Validate('Username is required', 400)
    if (!password) throw new Validate('Password is required', 400)
    const isEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    let searchCondition = {}

    if (isEmail.test(username)) {
      searchCondition = { where: { email: username } }
    } else {
      searchCondition = { where: { username } }
    }

    const userData = await User.findOne(searchCondition)

    if (!userData) throw new Validate('Cannot find this user', 400)

    const isPasswordCorrect = await bcrypt.compare(password, userData.password)

    if (!isPasswordCorrect) return res.status(400).json({ message: `Password is wrong` })

    const payload = {
      id: userData.id,
      username: userData.username,
      name: userData.name,
      role: userData.role
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: parseInt(EXPIRE) })

    res.status(200).json({ message: 'Sign in completed', token })

  } catch (err) {
    next(err)
  }
}
async function editAccount(req, res, next) {
  try {
    let id = req.user.status === 'SuperAdmin' ? req.query.id : req.user.id
    let newHashPassword;
    console.log(id)
    const { name, username, oldPassword, newPassword, confirmNewPassword, email, role, status, accountStatus } = req.body
    const userDataBeforeUpdate = await User.findOne({ where: { id } })

    if (newPassword) {
      const isOldPasswordCorrect = await bcrypt.compare(oldPassword, userDataBeforeUpdate.password)
      if (!isOldPasswordCorrect) throw new Validate('Please check old password', 400)
      newHashPassword = await bcrypt.hash(newPassword, parseInt(SALT_ROUND))
    }


    const sendData = {
      name: name || userDataBeforeUpdate.name,
      username: username || userDataBeforeUpdate.username,
      password: newHashPassword || userDataBeforeUpdate.password,
      email: email || userDataBeforeUpdate.email,
      role: role || userDataBeforeUpdate.role,
      status: req.user.status === 'SuperAdmin' ? status : userDataBeforeUpdate.status,
      accountStatus: req.user.status === 'SuperAdmin' ? accountStatus : req.user.status === 'Admin' ? accountStatus : userDataBeforeUpdate.accountStatus
    }

    await User.update(sendData, { where: { id } })

    res.status(200).json({ message: 'Updated' })
  } catch (err) {
    next(err)
  }

}

function getMe(req, res, next) {
  const { name, username, role, email, status } = req.user
  res.status(200).json({ name, username, role, email, status })
}

function getUser() { }

module.exports = {
  register,
  login,
  editAccount,
  getMe,
  getUser,
}
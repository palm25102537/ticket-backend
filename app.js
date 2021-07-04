require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const { sequelize } = require('./models')
const { PORT } = process.env
const userRoute = require('./route/UserRoute')
const homeworkRoute = require('./route/HomeworkRotue')
const subjectRoute = require('./route/SubjectRoute')
const error = require('./middleware/error')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/user', userRoute)
app.use('/homework', homeworkRoute)
app.use('/subject', subjectRoute)

app.use('/', (req, res) => res.status(404).json({ message: 'Path not found' }))
app.use(error)
// sequelize.sync({ alter: true }).then(console.log('DB sync'))

const port = PORT || 8080
app.listen(port, () => console.log(`Port ${port} is used`))
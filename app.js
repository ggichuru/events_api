const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(cors({origin: 'http://localhost:4200', credentials: true}))
app.use('/uploads', express.static('uploads'))

// Import routes
const eventsRoutes = require('./routes/eventsRoutes')
const userRoutes = require('./routes/userRoutes')
const imageRoutes = require('./routes/imageRoutes')

app.get('/', (req, res) => {
    res.send('Hello Human, welcome to New Age Scientific and Tech Solutions(NASATS) Labs')
})

// Define routes
app.use('/events', eventsRoutes)
app.use('/users', userRoutes)
app.use('/images', imageRoutes)

module.exports = app
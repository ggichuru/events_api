const express = require('express')
const eventsController = require('../controllers/events.controller')
const checkAuthMw = require('../middleware/check_auth')

const router = express.Router()

router.post('/', checkAuthMw.checkAuth, eventsController.addEvent)
router.get('/user/:userId', checkAuthMw.checkAuth, eventsController.getByUID)
router.get('/category/:categoryId', checkAuthMw.checkAuth, eventsController.getByCategory)
router.get('/:id', eventsController.getEventsById)
router.get('/', eventsController.getAllEvents)
router.patch('/:id', checkAuthMw.checkAuth, eventsController.updateEvent)
router.delete('/:id', checkAuthMw.checkAuth, eventsController.deleteEvent)

module.exports = router
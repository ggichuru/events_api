const express = require('express')
const imageController = require('../controllers/image.controller')
const imageUploader = require('../helpers/image.uploader')
const checkAuthMw = require('../middleware/check_auth')

const router = express.Router()

router.post('/upload', checkAuthMw.checkAuth, imageUploader.upload.single('image'), imageController.uploadImage)

module.exports = router
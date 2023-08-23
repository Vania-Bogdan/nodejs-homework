const express = require('express');

const router = express.Router();

const AuthControllers = require('../../controllers/auth/index')

const jsonParser = express.json();

const auth = require('../../middleware/auth')

router.post('/register', jsonParser, AuthControllers.register)
router.post('/login', jsonParser, AuthControllers.login)
router.post('/logout', auth, AuthControllers.logout)
router.get('/current', auth, AuthControllers.current)

module.exports = router
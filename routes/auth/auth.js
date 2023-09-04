const express = require('express');

const crypto = require('node:crypto');

const router = express.Router();

const AuthControllers = require('../../controllers/auth/index')

const jsonParser = express.json();

const auth = require('../../middleware/auth')

const path = require('node:path')

const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../', 'tmp'))
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extname);
        const name = `${basename}-${crypto.randomUUID()}${extname}`;

        cb(null, name)
    }
})

const upload = multer({ storage })

router.post('/register', jsonParser, AuthControllers.register)
router.post('/login', jsonParser, AuthControllers.login)
router.post('/logout', auth, AuthControllers.logout)
router.get('/current', auth, AuthControllers.current)
router.patch('/avatars', auth, upload.single('avatarURL'), AuthControllers.avatars)

module.exports = router
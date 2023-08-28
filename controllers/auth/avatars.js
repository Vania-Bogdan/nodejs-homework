const fs = require('node:fs/promises');

const Jimp = require('jimp')

const path = require('node:path');

const User = require('../../models/user')

async function avatars(req, res, next) {
    try {
        await fs.rename(req.file.path, path.join(__dirname, '../../', 'public/avatars', req.file.filename));

        const avatar = req.file.filename
        console.log(avatar)

        Jimp.read(avatar)
            .then((avatar) => {
                return avatar
                    .resize(256, 256) // resize
            })
            .catch((err) => {
                console.error(err);
            });

        const authHeader = req.headers.authorization;
        const [bearer, token] = authHeader.split(" ", 2)
        const oldUser = await User.findOne({ token }).exec()
        const userChanges = {
            avatarURL: avatar
        }

        const newUser = await User.findByIdAndUpdate(oldUser.id, userChanges, { new: true }).exec()

        return res.status(200).json({
            "avatarURL": newUser.avatarURL
        })
    } catch (e) {
        next(e);
    }
}

module.exports = avatars
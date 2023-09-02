const fs = require('node:fs/promises');

const Jimp = require('jimp')

const path = require('node:path');

const User = require('../../models/user')

async function avatars(req, res, next) {
    try {
        await fs.rename(req.file.path, path.join(__dirname, '../../', 'public/avatars', req.file.filename));

        const avatarsDir = path.join(__dirname, "..", "..", "public", "avatars", req.file.filename);


        const avatar = req.file.filename

        const userChanges = {
            avatarURL: avatar
        }

        try {
            const image = await Jimp.read(avatarsDir);
            image.resize(250, 250);
            image.quality(75);
            image.writeAsync(avatarsDir);
        } catch (e) {
            next(e);
        }

        await User.findByIdAndUpdate(req.user.id, userChanges, { new: true }).exec()

        return res.status(200).json({
            "avatarURL": req.file.filename
        })
    } catch (e) {
        next(e);
    }
}

module.exports = avatars
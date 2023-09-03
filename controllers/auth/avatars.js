const fs = require('node:fs/promises');

const Jimp = require('jimp')

const path = require('node:path');

const User = require('../../models/user')

async function avatars(req, res, next) {
    try {
        const name = req.file.filename

        await fs.rename(req.file.path, path.join(__dirname, '../../', 'public/avatars', name));

        const avatarsDir = path.join(__dirname, "..", "..", "public", "avatars", name);

        const avatarURL = path.join('avatars', name)

        try {
            const image = await Jimp.read(avatarsDir);
            image.resize(250, 250);
            image.quality(75);
            image.writeAsync(avatarsDir);
        } catch (e) {
            next(e);
        }

        await User.findByIdAndUpdate(req.user.id, { avatarURL }, { new: true }).exec()

        return res.status(200).json({
            avatarURL
        })
    } catch (e) {
        next(e);
    }
}

module.exports = avatars
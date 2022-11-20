const crypto = require("crypto")
const hash = async (password) => {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(128).toString("hex")

        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(salt + ":" + derivedKey.toString('hex'))
        });
    })
}

module.exports = {
    hash : hash
}
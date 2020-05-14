const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_TIMEOUT_DURATION;
const algorithm = process.env.JWT_ALGORITHM;

if (!secret || !expiresIn) {
    process.exit(-1);
}

const createAccessToken = data => jwt.sign(data, secret, { expiresIn, algorithm });
const decryptAccessToken = token => jwt.decode(token, secret, { expiresIn, algorithm });

module.exports = {
    createAccessToken,
    decryptAccessToken,
};
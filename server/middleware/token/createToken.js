const jwt = require('jsonwebtoken');
const config = require('../../config')

module.exports = function (username, userID) {
    const token = jwt.sign({
        username: username,
        userID: userID
    }, config.jwt.secret, {
        expiresIn: config.jwt.exp
    });

    return token;
}
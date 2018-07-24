const config = require('../config');
const createToken = require('../middleware/token/createToken');
const msg = require('../util/message');

const login = async (ctx, next) => {
    let { username, password } = ctx.request.body;

    if (username === 'admin' && password === '123') {
        let token = createToken('admin', '1');
        let errcode = 'LOGINSUCCESS'
        ctx.body = {
            code: errcode,
            msg: {
                token: token,
                username: '管理员'
            }
        }
    } else {
        let errcode = 'LOGINFAIL'
        ctx.body = {
            code: errcode,
            msg: msg[errcode]
        }
    }
}

module.exports = {
    login
}
const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = async (ctx, next) => {
    if (ctx.request.header['authorization']) {
        let token = ctx.request.header['authorization'];
        //console.log(token);
        try{
            var decoded = jwt.verify(token, config.jwt.secret);
        }catch(e){
            return (ctx.body = {
                code: 'INVALIDTOKEN',
                msg: e
            })
        }
        let username = decoded.username;
        let userID = decoded.userID;

        if (username === 'admin' && userID === '1') {
            await next();
        } else {
            return (ctx.body = {
                code: 'INVALIDTOKEN',
                msg: 'Token is invalid'
            })
        }
    } else {
        return (ctx.body = {
            code: 'NOTOKEN',
            msg: 'Please login'
        })
    }
}
const Router = require('koa-router')({
    prefix: '/api'
});

const accountRouter = require('./account');
const uploadRouter = require('./upload');
const getlistRouter = require('./getlist');
const getRselutRouter = require('./getresult');

Router.use(accountRouter.routes(), accountRouter.allowedMethods());
Router.use(uploadRouter.routes(), uploadRouter.allowedMethods());
Router.use(getlistRouter.routes(), getlistRouter.allowedMethods());
Router.use(getRselutRouter.routes(), getRselutRouter.allowedMethods());

module.exports = Router;
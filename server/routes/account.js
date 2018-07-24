const accoutAPI = require('../api/account');
const Router = require('koa-router');
const checkToken = require('../middleware/token/checkToken');

const accountRouter = new Router();

accountRouter.post('/login', accoutAPI.login);

module.exports = accountRouter;
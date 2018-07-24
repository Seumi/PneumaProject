const Router = require('koa-router');
const getlistAPI = require('../api/getlist');
const auth = require('../middleware/token/checkToken');

const getlistRouter = new Router();
getlistRouter.post('/getworksetlist', auth, getlistAPI.getlist);
getlistRouter.post('/delworkset',auth, getlistAPI.delworkset);
getlistRouter.post('/getbyuuid',auth, getlistAPI.getByUUID);

module.exports = getlistRouter;
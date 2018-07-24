const Router = require('koa-router');
const koaBody = require('koa-body');
const uploadAPI = require('../api/upload');
const auth = require('../middleware/token/checkToken')

const uploadRouter = new Router();

uploadRouter.post('/upload', auth, koaBody({multipart:true,formLimit: 1024 * 1024 * 50}), uploadAPI.upload);
uploadRouter.post('/uuid', auth, uploadAPI.uuid);
uploadRouter.post('/reupload',auth, koaBody({multipart:true,formLimit: 1024 * 1024 * 50}), uploadAPI.reupload)

module.exports = uploadRouter;


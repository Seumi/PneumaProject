const Router = require('koa-router');
const getResultAPI = require('../api/getresult');
const auth = require('../middleware/token/checkToken');

const getResultRouter = new Router();
getResultRouter.post('/getresult', auth, getResultAPI.getresult);
getResultRouter.get('/download/:uuid', getResultAPI.download)

module.exports = getResultRouter;
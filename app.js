const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger')
const mongoose = require('./server/util/connect')

app.use(bodyParser());
app.use(logger());
const router = require('./server/routes');

app.context.logContainer = {
    upload: [],
    unzip: [],
    filter: [],
    encoding: [],
    jplag: [],
    zip: []
}

app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})


app.use(router.routes())
    .use(router.allowedMethods());

app.listen(8888, () => {
    console.log('The server is running at http://localhost:' + 8888);
});
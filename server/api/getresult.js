const config = require('../config');
const path = require('path');
const send = require('koa-send');
const fs = require('fs');
const zipManger = require('../util/zipManger');

const getresult = async (ctx, next) => {
    let { uuid } = ctx.request.body;
    if (uuid) {
        let workPath = path.join(config.workplace.path, uuid);
        if (fs.existsSync(workPath)) {
            let resdir = fs.readdirSync(path.join(workPath, 'res'))
            if (resdir.length == 0) {
                ctx.body = {
                    code: 'RESULTNOTCREATE',
                    msg: '结果文件尚未创建，可能作业集尚未解析完成或出现解析错误'
                }
            } else {
                //先看下是否已存在
                if (fs.existsSync(path.join(workPath, 'res.zip'))) {
                    ctx.body = {
                        code: 'ZIPSUCCESS',
                        msg: {
                            url: '/api/download/' + uuid
                        }
                    }
                    return
                }
                //不存在则创建压缩文件
                let zipres = await zipManger.zip(workPath);

                if (typeof zipres === 'string') {
                    ctx.body = {
                        code: 'ZIPERR',
                        msg: '结果集创建错误' + zipres.replace(new RegExp(config.workplace.path, "gm"), '*')
                    }
                } else {
                    //返回结果
                    ctx.body = {
                        code: 'ZIPSUCCESS',
                        msg: {
                            url: '/api/download/' + uuid
                        }
                    }
                }
            }
        } else {
            ctx.body = {
                code: 'CANNOTFOUNDUUID',
                msg: '无法找到该作业集的结果文件，可能是结果集解析出错或者已被删除'
            }
        }
    } else {
        ctx.body = {
            code: 'INVAILDUUID',
            msg: '参数错误'
        }
    }
}

const download = async (ctx, next) => {
    let uuid = ctx.params.uuid;
    console.log(uuid);
    let fpath = path.join(config.workplace.path, uuid, 'res.zip');
    ctx.attachment('作业集' + uuid.substr(0,8) + '检测结果.zip');
    await send(ctx, fpath, { root: '/' });
}

module.exports = {
    getresult,
    download
}
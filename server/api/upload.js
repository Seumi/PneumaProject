const uuidv1 = require('uuid/v1');
const fs = require('fs');
const path = require('path');
const config = require('../config')
const workSet = require('../model/workset')
const mongoose = require('../util/connect');
const workSetModel = mongoose.model('workset');
const moment = require('moment');
const doWork = require('./dowork');
const fileManger = require('../util/fileManger');

const mkdir = (uuid) => {
    let fpath = path.join(config.workplace.path, uuid);
    if (!fs.existsSync(fpath)) {
        fs.mkdirSync(fpath);
        //fs.mkdirSync(path.join(fpath, 'src'));
        fs.mkdirSync(path.join(fpath, 'res'));
        return true;
    } else {
        return false;
    }
}

const reupload = async (ctx, next) => {
    let { fields, files } = ctx.request.body;
    let res = await workSetModel.findOne({ uuid: fields.uuid }).exec();
    if(!res) {
        ctx.body = {
            code: 'REUPLOADERR',
            msg: '作业集不存在'
        }
        return
    }

    if(fs.existsSync(path.join(config.workplace.path, fields.uuid))){
        await fileManger.fileDelete(fields.uuid);
    }

    if(fs.existsSync(path.join(config.workplace.path, 'unzip', fields.uuid))){
        await fileManger.fileDelete(path.join('unzip', fields.uuid));
    }

    try{
        await mkdir(fields.uuid);
        await fileManger.fileMove(files.file.path, path.join(config.workplace.path, fields.uuid, files.file.name))
    } catch(e) {
        ctx.body = {
            code: 'REUPLOADIOERR',
            msg: '文件IO出错' + e
        }
        return
    }
    res.status = '[MSG]重上传初始化';
    res.log.push(moment().format('YYYY-MM-DD HH:mm') + ' ' + '作业集重上传');
    await res.save();
    ctx.body = {
        code: 'REUPLOADSUCCESS',
        msg: '重上传成功'
    }

    doWork(fields.uuid);
}

const upload = async (ctx, next) => {
    let { fields, files } = ctx.request.body;

    //TODO 
    //表单验证

    let uuid = uuidv1();
    await mkdir(uuid);

    let workset = new workSet({
        uuid: uuid,
        title: fields.title,
        lang: fields.lang,
        bc: fields.bc === 'false' ? false : true,
        threshold: fields.threshold,
        mml: fields.mml,
        thtype: fields.thtype,
        comment: fields.comment,
        status: '[MSG]初始化',
        createtime: Date.now(),
        log: moment().format('YYYY-MM-DD HH:mm') + ' ' + '已创建'
    });

    try {
        await workset.save();
        await fileManger.fileMove(files.file.path, path.join(config.workplace.path, uuid, files.file.name))
        //await fs.createReadStream(files.file.path).pipe(fs.createWriteStream(path.join(config.workplace.path, uuid, files.file.name)));
    } catch (e) {
        ctx.body = {
            code: 'FILEUPLOADERROR',
            msg: e.message
        }
        return
    }

    ctx.body = {
        code: 'FILEUPLOADSUCCESS',
        msg: ''
    }
    doWork(uuid);
}

const uuid = async (ctx, next) => {
    let { flag, langType } = ctx.request.body;
    let uuid = uuidv1() + '-' + langType;
    if (flag === 'pneuma' && langType) {
        if (mkdir(uuid)) {
            ctx.body = {
                code: 'GETUUIDSUCCESS',
                msg: uuid
            }
        } else {
            ctx.body = {
                code: 'INNERERROR',
                msg: 'can not create dir'
            }
        }
    } else {
        ctx.body = {
            code: 'GETUUIDFAIL',
            msg: 'err param'
        }
    }
}

module.exports = {
    upload,
    uuid,
    reupload
}
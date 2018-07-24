const mongoose = require('../util/connect');
const workSet = mongoose.model('workset');
const config = require('../config');
const moment = require('moment');
const xss = require('xss')
const fs = require('fs');
const path = require('path');
const fileManger = require('../util/fileManger');

const getlist = async (ctx, next) => {
    let { page, pagesize, title } = ctx.request.body;
    try {
        if(title === ''){
            var total = await workSet.count({}).exec();
            var res = await workSet.find({}).sort({ 'createtime': -1 }).limit(pagesize).skip(pagesize * (page - 1)).exec();
        } else {
            let searchReg = new RegExp(title,'i');
            var total = await workSet.count({title:searchReg}).exec();
            var res = await workSet.find({title:searchReg}).sort({ 'createtime': -1 }).limit(pagesize).skip(pagesize * (page - 1)).exec();
        }
    } catch (e) {
        ctx.body = {
            code: 'GETLISTFAIL',
            msg: e.message
        }
    }
    var payload = []
    res.forEach((item) => {
        let tmp = {
            uuid: item.uuid,
            title: item.title,
            lang: item.lang,
            mml: item.mml,
            threshold: item.threshold,
            thtype: item.thtype,
            status: item.status,
            comment: item.comment,
            log: item.log,
            createtime: moment(item.createtime, 'x').format('YYYY-MM-DD HH:mm'),
        }
        payload.push(tmp);
    })
    ctx.body = {
        code: 'GETLISTSUCCESS',
        msg: {
            items: payload,
            total: total
        }
    }
}

const delworkset = async (ctx, next) => {
    let { uuid } = ctx.request.body;
    if (fs.existsSync(path.join(config.workplace.path, uuid))) {
        fileManger.fileDelete(uuid);
    }
    if (fs.existsSync(path.join(config.workplace.path, 'unzip', uuid))) {
        fileManger.fileDelete(path.join('unzip', uuid));
    }
    try {
        await workSet.findOneAndRemove({ uuid: uuid }).exec();
    } catch (e) {
        ctx.body = {
            code: 'DELFAIL',
            msg: '从数据库删除失败' + e
        }
    }
    ctx.body = {
        code: 'DELSUCCESS',
        msg: '删除成功'
    }
}

const getByUUID = async (ctx, next) => {
    let { uuid } = ctx.request.body;

    try {
        var item = await workSet.findOne({ uuid: uuid }).exec();
    } catch (e) {
        ctx.body = {
            code: 'GETONEFAIL',
            msg: '获取作业集信息失败' + e
        }
    }
    ctx.body = {
        code: 'GETONESUCCESS',
        msg: {
            uuid: item.uuid,
            title: item.title,
            lang: item.lang,
            mml: item.mml,
            bc: item.bc,
            threshold: item.threshold,
            thtype: item.thtype,
            status: item.status,
            comment: item.comment,
            log: item.log,
            createtime: moment(item.createtime, 'x').format('YYYY-MM-DD HH:mm'),
        }
    }
}

//废弃
const serachByTitle = async (ctx, next) => {
    let { title } = ctx.request.body;

}

module.exports = {
    getlist,
    delworkset,
    getByUUID
}
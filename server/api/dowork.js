const fs = require('fs');
const path = require('path');
const msg = require('../util/message');
const zipManger = require('../util/zipManger');
const fileManger = require('../util/fileManger');
const config = require('../config');
const workset = require('../model/workset')
const mongoose = require('../util/connect');
const workSet = mongoose.model('workset');
const moment = require('moment');

const processLog = async (model, status, log) => {
    model.status = status;
    model.log.push(log);
    await model.save();
}

const dirExist = (path) => {
    if (!fs.existsSync(path)) {
        return false;
    } else {
        return true
    }
}

const zipExist = (path) => {
    let filelist = fs.readdirSync(path);
    let filename = '';
    filelist.forEach((item) => {
        item = item.toLowerCase()
        if (item.endsWith('.zip')) {
            filename = item.replace('.zip', '');
        }
    })
    return filename;
}

const doWork = async (uuid) => {
    let workpath = path.join(config.workplace.path, uuid);
    let currentWork = await workSet.findOne({ uuid: uuid }).exec();

    if (!currentWork) {
        console.log('不存在该作业集');
        return
    }

    await processLog(currentWork, '[MSG]预处理中', moment().format('YYYY-MM-DD HH:mm') + ' ' + '开始进行文件预处理...')
    //检查是否存在工作文件夹
    if (!dirExist(workpath)) {
        let errcode = 'WORKPATHNOTFOUND'
        // ctx.body = {
        //     code: errcode,
        //     msg: msg[errcode]
        // }
        console.log(errcode);
        await processLog(currentWork, '[ERR]工作文件夹错误', moment().format('YYYY-MM-DD HH:mm') + ' ' + '找不到该作业集的工作目录')
        return
    }

    //检查是否有ZIP文件
    let zipFileName = zipExist(workpath);
    if (zipFileName === '') {
        let errcode = 'ZIPFILENOTFOUND'
        // ctx.body = {
        //     code: errcode,
        //     msg: msg[errcode]
        // }
        await processLog(currentWork, '[ERR]ZIP文件错误', moment().format('YYYY-MM-DD HH:mm') + ' ' + '找不到该作业集的压缩文件')
        console.log(errcode);
        return
    }

    //解压
    let unzipSource = path.join(workpath, zipFileName + '.zip');
    let unzipDest = path.join(workpath, '../unzip', uuid);
    let unzipResult = await zipManger.unzip(unzipSource, unzipDest)
    if (typeof unzipResult === 'string') {
        let ercode = 'UNZIPFAIL';

        await processLog(currentWork, '[ERR]解压错误', moment().format('YYYY-MM-DD HH:mm') + ' ' + '文件解压失败：' + unzipResult.replace(new RegExp(config.workplace.path, "gm"), '*'))
        console.log(ercode + ':' + unzipResult);
        return
    }

    //文件夹结构调整
    let currentDir = unzipDest;
    let currentDirList = fs.readdirSync(currentDir);
    //找到一个包含多文件的目录
    while (currentDirList.length == 1) {
        currentDir = path.join(currentDir, currentDirList[0]);
        try {
            currentDirList = fs.readdirSync(currentDir);
        } catch (e) {
            let errcode = 'UNKNOWDIRSTRUCTURE'

            await processLog(currentWork, '[ERR]文件夹结构错误', moment().format('YYYY-MM-DD HH:mm') + ' ' + '发现不合理的文件夹结构，无法解析')
            console.log(errcode);
            return
        }
    }

    //停用代码检查
    if (currentWork.bc) {
        currentDirList = fs.readdirSync(currentDir);
        if (currentDirList.indexOf('@BASECODE') === -1) {
            let errcode = 'CANNOTFOUNDBASECODE'
            await processLog(currentWork, '[ERR]无停用代码', moment().format('YYYY-MM-DD HH:mm') + ' ' + '找不到合法的停用代码文件夹@BASECODE')
            console.log(errcode);
            return
        }
    }

    let mvDestDir = path.join(workpath, 'src');
    //先把原来的src删除
    if (fs.existsSync(mvDestDir)) {
        let delResult = await fileManger.fileDelete(path.join(uuid, 'src'));
        if (typeof delResult === 'string') {
            let errcode = 'DELETEDIRFAIL'

            await processLog(currentWork, '[ERR]文件IO错误', moment().format('YYYY-MM-DD HH:mm') + ' ' + '清理临时文件夹失败')
            console.log(errcode + ':' + delResult);
            return
        }
    }
    //开始移动
    console.log('move')
    let mvResult = await fileManger.fileMove(currentDir, mvDestDir);
    if (typeof mvResult === 'string') {
        let errcode = 'MOVEDIRFAIL'

        await processLog(currentWork, '[ERR]文件IO错误', moment().format('YYYY-MM-DD HH:mm') + ' ' + '移动临时文件夹失败')
        console.log(errcode + ':' + mvResult);
        return
    }

    //然后删除解压缩的文件
    if (fs.existsSync(path.join(config.workplace.path, 'unzip', uuid))) {
        let delResult = await fileManger.fileDelete(path.join('unzip', uuid));
        if (typeof delResult === 'string') {
            let errcode = 'DELETEZIPDIRFAIL'

            await processLog(currentWork, '[ERR]文件IO错误', moment().format('YYYY-MM-DD HH:mm') + ' ' + '删除临时文件失败')
            console.log(errcode + ':' + delResult);
            return
        }
    }

    //文件类型过滤
    console.log('filter')
    let langType = currentWork.lang;
    let filterResult = await fileManger.fileFilter(mvDestDir, config.langtype[langType].ext);
    if (typeof filterResult === 'string') {
        let ercode = 'FILTERFILEFAIL'

        await processLog(currentWork, '[ERR]文件类型过滤错误', moment().format('YYYY-MM-DD HH:mm') + ' ' + '过滤文件类型失败：' + filterResult.replace(new RegExp(config.workplace.path, "gm"), '*'))
        console.log(errcode + ':' + filterResult);
        return
    }

    //重编码
    console.log('encodeing')
    let encodingResult = await fileManger.fileEncode(mvDestDir);
    if (typeof encodingResult === 'string') {
        let errcode = 'ENCODINGFILEFAIL'

        await processLog(currentWork, '[ERR]重编码错误', moment().format('YYYY-MM-DD HH:mm') + ' ' + '文件重编码失败：' + encodingResult.replace(new RegExp(config.workplace.path, "gm"), '*'))
        console.log(errcode + ':' + encodingResult);
        return
    }
    //重编码异常提醒
    if (encodingResult.stderr !== '') {
        await processLog(currentWork, '[MSG]预处理中', moment().format('YYYY-MM-DD HH:mm') + ' ' + '文件重编码成功，但部分文件存在异常：' + encodingResult.stderr.replace(new RegExp(mvDestDir, "gm"), '*'))
        //console.log(encodingResult.stderr.replace(new RegExp(mvDestDir, "gm"), '*'));
    }

    //Let`s go
    console.log('jplag')
    await processLog(currentWork, '[MSG]正在解析', moment().format('YYYY-MM-DD HH:mm') + ' ' + '开始解析作业集...')
    let parseDir = mvDestDir;
    let parseResultDir = path.join(workpath, 'res');
    let bc = currentWork.bc;
    let parseResult = await fileManger.fileParse(parseDir, parseResultDir, langType, bc, currentWork.mml, currentWork.title, currentWork.thtype, currentWork.threshold);

    if (typeof parseResult === 'string') {
        if (fs.existsSync(path.join(parseResultDir, 'err.txt'))) {
            let errtxt = fs.readFileSync(path.join(parseResultDir, 'err.txt'), 'utf-8');
            let index = errtxt.indexOf('[FATAL]');
            if (index != -1) {
                parseResult = errtxt.substring(index + 7, errtxt.indexOf('\n', index));
            }
        }

        await processLog(currentWork, '[ERR]解析错误', moment().format('YYYY-MM-DD HH:mm') + ' ' + '解析过程中发生错误:' + parseResult.replace(new RegExp(config.workplace.path, "gm"), '*'))
        console.log(parseResult);
        return
    }

    //完成
    processLog(currentWork, '[SUC]完成', moment().format('YYYY-MM-DD HH:mm') + ' ' + '解析完成，解析中发生的异常请查看解析日志');
    console.log('Bingo!All Done!');
};

module.exports = doWork;

// (async () => {
//     doWork('ba8a65c0-4f6a-11e8-ac63-d5b3942a8768');
// })();
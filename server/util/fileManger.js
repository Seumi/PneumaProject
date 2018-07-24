const shell = require('./shellManger')
const config = require('../config')
const path = require('path');

const fileFilter = async (dir, ext) => {
    let cmdStr = 'find ' + dir + ' -type f ! -regex ".*\\';
    ext.forEach(item => {
        cmdStr += item;
        cmdStr += '\\|.*\\'
    });
    cmdStr = cmdStr.replace(/\\\|\.\*\\$/, '');
    cmdStr += '" -delete';
    try {
        var fileFilterres = await shell(cmdStr);
    } catch (e) {
        return e.message;
    }
    return fileFilterres;
}

const fileEncode = async (dir) => {
    let cmdStr = 'find ' + dir + ' -type f -exec enca -x utf-8 {} \\;';
    try {
        var fileEncoderes = await shell(cmdStr);
    } catch (e) {
        return e.message;
    }
    return fileEncoderes;
}

const fileMove = async (source, dest) => {
    let cmdStr = 'mv ' + source + ' ' + dest;
    try {
        var fileMoveres = await shell(cmdStr);
    } catch (e) {
        return e.message;
    }
    return fileMoveres;
}

const fileDelete = async (fpath) => {
    let cmdStr = 'rm -rf ' + path.join(config.workplace.path, fpath);
    try {
        var fileDeleteres = await shell(cmdStr);
    } catch (e) {
        return e.message;
    }
    return fileDeleteres;
}

const fileParse = async (src, resdir, langType, bc, mml, title, thtype, threshold) => {
    let cmdStr = 'java -jar ' + config.workplace.bin 
    + ' -l ' + config.langtype[langType].name 
    + ' -t ' + mml 
    + ' -title ' + title
    + ' -m '+ threshold + (thtype==='1'?'':'%') 
    +  (bc ? ' -bc @BASECODE' : '') 
    + ' -r ' + resdir 
    + ' -s -vlpd ' 
    + src 
    + ' >' + path.join(resdir, 'err.txt') + ' 2>&1';
    try {
        var parseResult = await shell(cmdStr);
    } catch (e) {
        //console.log(e);
        return e.message;
    }
    return parseResult;
}

module.exports = {
    fileFilter,
    fileEncode,
    fileMove,
    fileDelete,
    fileParse
}
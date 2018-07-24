const shell = require('./shellManger');
const path = require('path')

const unzip = async (source,dest) => {
    let cmdStr = 'unzip -q -a ' + source + ' -d ' + dest;
    try{
        var unzipres = await shell(cmdStr);
    }catch(e){
        return e.message;
    }
    return unzipres;
}

const zip = async (source) => {
    let cmdStr = 'cd '+ source + '&&zip -q -r res.zip res';
    try{
        var zipres = await shell(cmdStr);
    }catch(e){
        return e.message;
    }
    return zipres;
}

module.exports = {
    unzip,
    zip
}
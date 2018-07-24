const moment = require('moment');

const logContainer = {
    upload: [],
    unzip: [],
    filter: [],
    encoding: [],
    jplag: [],
    zip: []
}

const addLog = (level, type, log) => {
    let logStr = '[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']['+ level + '] ' + log;
    logContainer[type].push(logStr);
}

module.exports = {
    logContainer,
    addLog
}
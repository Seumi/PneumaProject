const exec = require('child_process').exec;

const doCmd =  async (str) => {
    return new Promise((resolve, reject) => {
        exec(str, function(err,stdout,stderr){
            if(!err) {
                let result = {
                    stdout: stdout,
                    stderr: stderr
                }
                resolve(result);
            } else {
                reject(err);
            }
        })
    })
}

module.exports = doCmd;
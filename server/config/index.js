module.exports = {
    jwt: {
        secret: 'pneuma0.01', //jwt签名的密钥
        exp: '1h' //jwt过期时间
    },
    workplace: {
        path: '/home/seumi/pneuma', //工作路径
        bin: '/home/seumi/pneuma/bin.jar' //JPlag的jar文件路径
    },
    langtype: {
        java: {
            name: 'java17',
            ext: [".java", ".jav", ".JAVA", ".JAV"]
        },
        csharp: {
            name: 'c#-1.2',
            ext: [".cs", ".CS"]
        },
        ccpp: {
            name: 'c/c++',
            ext: [".cpp", ".CPP", ".cxx", ".CXX", ".c++", ".C++", ".c", ".C", ".cc", ".CC", ".h", ".H", ".hpp", ".HPP", ".hh", ".HH"]
        },
        python: {
            name: 'python3',
            ext: [".py"]
        },
        web: {
            name: 'text',
            ext: ['.html', '.htm', '.css', '.js', '.asp', '.aspx']
        },
        text: {
            name: 'text',
            ext: [".TXT", ".txt", ".ASC", ".asc", ".TEX", ".tex"]
        }
    },
    mongodb: {
        uri: 'mongodb://127.0.0.1:27017/pneuma',//数据库地址
        options: {
            //连接选项（可选）
        }
    }
}
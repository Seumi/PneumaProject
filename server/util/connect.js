const mongoose = require('mongoose');
const config = require('../config');

// 连接数据库.
mongoose.connect(config.mongodb.uri, config.mongodb.options);
mongoose.Promise = global.Promise;

module.exports = mongoose;
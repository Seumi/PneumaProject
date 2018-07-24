const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkSetSchema = new Schema({
    uuid: { type: String, unique: true },
    title: { type: String },
    lang: { type: String },
    bc: { type: Boolean },
    threshold: { type: String },
    mml: { type: String },
    thtype: { type: String },
    comment: { type: String },
    status: { type: String },
    createtime: { type: String },
    log: [{ type: String }]
});

module.exports = mongoose.model('workset', WorkSetSchema);
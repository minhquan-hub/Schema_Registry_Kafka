const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    message: {type: String}
}, { timestamps: true })

const Log = mongoose.model('log', logSchema);

module.exports = Log;
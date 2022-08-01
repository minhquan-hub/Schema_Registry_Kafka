const mongoose = require('mongoose')

const SchemaModel = new mongoose.Schema({
    schema: {
        type: {}
    }
}, { timestamps: true })

const Schema = mongoose.model('schema', SchemaModel)

module.exports = Schema
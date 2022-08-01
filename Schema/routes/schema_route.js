const express = require('express');
const route = express.Router();

const SchemaController = require('../controllers/schema_controller')

route.post('/', SchemaController.postSchema);
route.get('/:id', SchemaController.getSchema);

module.exports = route;
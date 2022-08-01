const SchemaModel = require('../model/schema_model');

const schemaController = {
    postSchema: async(req, res) => {
        try {
            const schemaData = req.body.schema;
            const schema = await SchemaModel.create({ schema: schemaData })

            res.status(200).json(schema);
        } catch (err) {
            console.error(err);
            res.status(500).json("Something server error");
        }
    },

    getSchema: async(req, res) => {
        try {
            const id = req.params.id;
            const getSchema = await SchemaModel.findById(id)

            res.status(200).json(getSchema.schema);
        } catch (err) {
            console.error(err);
            res.status(500).json("Something server error");
        }
    }
}

module.exports = schemaController
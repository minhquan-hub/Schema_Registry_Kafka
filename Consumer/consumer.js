const { Kafka, logLevel } = require("kafkajs")
const { SchemaRegistry } = require('@kafkajs/confluent-schema-registry')
const avro = require("avsc")
const axios = require("axios")

const registry = new SchemaRegistry({ host: 'http://localhost:8081' })
const connectdb = require("../connectdb")
const Log = require("../log")

const clientId = "my-app"
const brokers = ["13.250.26.9:9092"]
const topic = "send-message"
connectdb

const getSchema = async(id) => {
    const schema = await axios.get(`http://13.212.25.226:4042/api/schema/${id}`)
        .then((res) => {
            // console.log(res.data);
            return res.data
        })
        .catch((error) => {
            console.log(error);
        })

    return schema
}

const kafka = new Kafka({
    clientId,
    brokers,
    // logCreator: customLogger,
    // logLevel: logLevel.DEBUG,
})

const typeMessage = avro.Type.forSchema({
    type: "record",
    fields: [
        { name: "id", type: "string" },
        { name: "message", type: "string" },
    ],
})

const consumer = kafka.consumer({
    groupId: clientId,
    minBytes: 5,
    maxBytes: 1e6,
    maxWaitTimeInMs: 3000,
})

const consume = async() => {
    await consumer.connect()
    await consumer.subscribe({ topic })
    await consumer.run({
        eachMessage: async({ message }) => {
            // console.log("Schema:" + schema)
            console.log("Value: " + message.value)
            const decodeValue = typeMessage.fromBuffer(message.value)
            const id = decodeValue.id

            const schema = await getSchema(id)
            console.log("Schema: " + schema)

            const type = avro.Type.forSchema(schema);
            const messageParse = JSON.parse(decodeValue.message)
            const getMessage = Buffer.from(messageParse.data);
            console.log("Message: " + getMessage)

            const decodeMessage = type.fromBuffer(getMessage)
            const log = await Log.create({ message: decodeMessage.name })
            console.log("Log: " + log)

            console.log("id: " + id)
        },
    })
}

consume()
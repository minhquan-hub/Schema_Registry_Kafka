const { Kafka } = require("kafkajs")
const axios = require("axios")
const avro = require("avsc")

const clientId = "my-app"
const brokers = ["13.250.26.9:9092"]
const topic = "send-message"

const type = avro.Type.forSchema({
    type: "record",
    fields: [
        { name: "kind", type: { type: "enum", symbols: ["C", "JAVA"] } },
        { name: "name", type: "string" }
    ]
})

const typeMessage = avro.Type.forSchema({
    type: "record",
    fields: [
        { name: "id", type: "string" },
        { name: "message", type: "string" },
    ],
})

const kafka = new Kafka({ clientId, brokers })
const producer = kafka.producer()

const addSchema = async() => {
    const id = await axios.post("http://13.212.25.226:4042/api/schema", { schema: type })
        .then((res) => { return res.data._id })
        .catch((error) => {
            console.log("error: " + error.message)
        })
    return id;
}

const produce = async() => {
    const idSchema = await addSchema()
    console.log("id: " + idSchema)
    await producer.connect()
    let i = 0
    setInterval(async() => {
        try {
            const encodeData = await type.toBuffer({
                kind: "C",
                name: "Quan" + i
            });

            const encodeValue = await typeMessage.toBuffer({
                id: idSchema,
                message: JSON.stringify(encodeData)
            })
            console.log("encodeValue: " + encodeValue + "\n")

            await producer.send({
                topic,
                messages: [{
                    value: encodeValue
                }, ],
            })
            i++
        } catch (err) {
            console.error("could not write message " + err)
        }
    }, 1000)
}

produce()
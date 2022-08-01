const mongoose = require('mongoose');

const connect = () => { mongoose
    .connect("mongodb+srv://quantran:quan01864565731@bookstoredb.8cfniyp.mongodb.net/kafka", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log('Failed to connect to MongoDB', err)
    });
}

module.exports = connect()
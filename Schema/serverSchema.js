const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const SchemaRoute = require('./routes/schema_route')

const app = express();
const port = 4042;

// Connect mongodb
mongoose
    .connect(
        "mongodb+srv://quantran:quan01864565731@bookstoredb.8cfniyp.mongodb.net/SchemaResigtry", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Failed to connect to MongoDB", err);
    });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

// Router
app.use("/api/schema", SchemaRoute);

app.listen(port, () => {
    console.log(`Server listening on http://13.212.25.226:${port}`);
});
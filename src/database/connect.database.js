const config = require('dotenv');
const mongoose = require('mongoose');

config.config();

mongoose.connect(process.env.MONGODB_URI,{useUnifiedTopology: true, useNewUrlParser:true})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});
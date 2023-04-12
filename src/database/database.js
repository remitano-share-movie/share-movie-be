const config = require('dotenv');
const mongoose = require('mongoose');

config.config();

const Connect = async () => {
    const uri = process.env.MONGODB_URI;
    return await mongoose.connect(uri,{useUnifiedTopology: true, useNewUrlParser:true});
}

module.exports = Connect;
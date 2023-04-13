const mongoose = require('mongoose');

class User {
    constructor({
        id=null,
        username=null,
        password=null,
        access_token=null,
        created_at=null,
        updated_at=null,
    }) {
        this._id = id;
        this.username = username;
        this.password = password;
        this.access_token = access_token;
        this.updated_at = updated_at;
        this.created_at = created_at;
    }
}

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        unique: true,
        index: true,
        required: true
      },
    password: {
        type: String,
        required: true
      },
    access_token: String,
    updated_at: Number,
    created_at: Number,
}, {versionKey: false});

const userModel = mongoose.model('user', userSchema);

module.exports = {
    User,
    userModel
}
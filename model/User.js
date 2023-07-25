const mongoose = require('mongoose');
const {v4: uuid} = require('uuid');

const userSchema = new mongoose.Schema({
    _id : { type: String, default: uuid },
    email : { type: String, required: true, unique: true, trim: true, lowercase: true },
    todos : [{ type: String, ref: 'Todo' }],
    hashPassword : { type: String, required: true },
    createdAt : { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
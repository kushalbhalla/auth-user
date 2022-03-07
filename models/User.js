const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//user schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        min: 5,
        required: true
    },
    
});

module.exports = mongoose.model('User', userSchema);
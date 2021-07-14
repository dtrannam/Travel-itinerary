const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    username:
    {
        type: String,
        required: [true, "Username required"]
    },
    password:     
    {
        type: String,
        required: [true, "Password required"]
    },
    comments: Array,
    itinerary: Array,
})

module.exports = mongoose.model('User', userSchema)


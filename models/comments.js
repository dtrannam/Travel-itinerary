const mongoose = require('mongoose');
const Schema = mongoose.Schema


const commentSchema = new Schema({
    name: String,
    date: String,
    comment: {
        type: String,
        require: [true, 'requires entry']
    }

})

module.exports = mongoose.model('Comment', commentSchema)
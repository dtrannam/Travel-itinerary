const mongoose = require('mongoose');
const Comment = require('./comments')
const Schema = mongoose.Schema


const itinerarySchema = new Schema({
    title: String,
    location: String,
    description: String,
    traveler: String,
    theme: String,
    days: Number,
    items: Array,
    comments: [
        {
        type: Schema.Types.ObjectId, ref: 'Comment' 
        }
    ]
})

module.exports = mongoose.model('itinerary', itinerarySchema)
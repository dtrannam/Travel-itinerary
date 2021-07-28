const mongoose = require('mongoose');
const Comment = require('./comments')
const Schema = mongoose.Schema


const itinerarySchema = new Schema({
    title: String,
    location: String,
    description: String,
    traveler: String,
    theme: String,
    notes: String,
    short: String,
    days: Number,
    items: Array,
    images: [
        {
        url : String, 
        fileName: String
    }],
    comments: [
        {
        type: Schema.Types.ObjectId, ref: 'Comment' 
        }
    ],
    author: 
        {
        type: Schema.Types.ObjectId, ref: 'User' 
        }
})

module.exports = mongoose.model('itinerary', itinerarySchema)
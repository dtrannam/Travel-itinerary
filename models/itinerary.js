const mongoose = require('mongoose');
const Schema = mongoose.Schema


const itinerarySchema = new Schema({
    title: String,
    location: String,
    description: String,
    traveler: String,
    theme: String,
    days: Number,
    items: Array,
})
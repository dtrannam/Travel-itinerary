// Express Set Up
const express = require('express');
const app = express()
const path = require('path')


// EJS Set Up
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// CSS Set Up
app.use(express.static('public'));

// Mongoose Set Up
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/itinerary', 
    {useNewUrlParser: true, useUnifiedTopology: true    
})
const itinerary = require('./models/itinerary');
const { response } = require('express');


// Mongoose Connection Check
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Mongoose is connected')
});


//Routing 
app.get('/', (req, res) => {
    res.render('home')
})

///// READ

// Show one item example: 60bffd15b5745f122006bbdc
app.get('/itinerary/:id', async (req, res) => {
    const { id } = req.params;
    let item = await itinerary.findById(id)
    res.render('view', { item })
})

// Show all
app.get('/itinerary', async (req, res) => {
    const allItinerary = await itinerary.find({});
    console.log(allItinerary)
    res.render('viewall', { allItinerary })
    
})

// Create Item
app.get('/create', (req, res) =>{
    res.render('create')
})

// Set Up
app.listen(3000, () => {
     console.log('Port 3000 is working')
})


// Testing
// app.get('/new', async (req, res) => {
//     const camp = new itinerary(
//         {
//             title: 'Orange County',
//             location: 'Orange County, CA',
//             description: '2 days in Orange County! ',
//             traveler: 'Mixed',
//             theme: 'Urban',
//             days: 2,
//             items: [
//                 'Disneyland is the the best thing to do in OC!',
//                 'Huntington Beach - Surf City USA'
//             ] 
//         }
//     )
//     await camp.save()
//     res.send(camp)
// })


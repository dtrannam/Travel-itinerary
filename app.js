// Express Set Up
const express = require('express');
const app = express()
const path = require('path')

// Data parsing 
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Method Override Set Up
var methodOverride = require('method-override')
app.use(methodOverride('_method'))


// EJS Set Up
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// CSS/JS Set Up
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

// Show one item 
app.get('/itinerary/:id', async (req, res) => {
    const { id } = req.params;
    let item = await itinerary.findById(id)
    res.render('view', { item })
})

// Show all
app.get('/itinerary', async (req, res) => {
    const allItinerary = await itinerary.find({})
    res.render('viewall', { allItinerary })
    
})

// Create Item
app.get('/create', (req, res) =>{
    res.render('create')
})

app.post('/create', async (req, res) => {
    try {
        const newItem = new itinerary(
            {
                title: req.body.name,
                location: req.body.location,
                description: req.body.desc,
                traveler: req.body.traveler,
                theme: req.body.focus,
                days:req.body.days,
                items: req.body.items
            }
        )
        await newItem.save(
            function(err, item) {
                if (err) {
                    console.log(err);
                    res.send('Shits bad yo')
                } else {
                    res.send(newItem._id)                
                }
            }
        )
    
    }  catch (err) {
    res.render('/itinerary')
    }
})



// Delete Item

app.delete('/itinerary/:id', async (req, res) => {
    const { id } = req.params
    const remove = await itinerary.findByIdAndDelete(id);
    res.redirect('/itinerary')
})


// Update.
app.get('/itinerary/:id/edit', async (req,res) => {
    const { id } = req.params
    const item = await itinerary.findById(id)
    res.render('edit', { item })
})

app.put('/')

// Set Up
app.listen(3000, () => {
     console.log('Port 3000 is working')
})




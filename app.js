// Express Set Up
const express = require('express')
const app = express()
const path = require('path')

// EJS Set Up
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// CSS Set Up
app.use(express.static('public'));


//Routing 
app.get('/', (req, res) => {
    res.render('home')
})



// Set Up
app.listen(3000, () => {
     console.log('Port 3000 is working')
})
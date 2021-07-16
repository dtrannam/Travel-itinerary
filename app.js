// Express Set Up
const express = require('express')
const ejsmate = require('ejs-mate')
const app = express()
const path = require('path')
const AppError = require('./AppError')

// Data parsing 
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Method Override Set Up
var methodOverride = require('method-override')
app.use(methodOverride('_method'))


// EJS Set Up
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsmate)

// CSS/JS Set Up
app.use(express.static('public'));

// Mongoose Set Up
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
mongoose.connect('mongodb://localhost:27017/itinerary', 
    {useNewUrlParser: true, useUnifiedTopology: true    
})
const itinerary = require('./models/itinerary');
const comment = require('./models/comments');
const user = require('./models/user')
const { response } = require('express');


// Mongoose Connection Check
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Mongoose is connected')
});

// Passport/Session/Flash Set up

const session = require('express-session')
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true
}))

const User = require('./models/user')
const passport = require('passport');
const passportLocal = require('passport-local')
passport.use(new passportLocal(User.authenticate()))
app.use(passport.initialize())
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var flash = require('connect-flash');
app.use(flash());

// Middleware that will add any success flash key to the local so we don't have to do it per route.
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.failure = req.flash('failure')
    next();
})

// API Connection + Fetch
const fetch = require("node-fetch");
const apiKey = 'fDJa1LEqLJHwrrXtbFXRwE3jEzeJcq4IwxflP-8hBEL84cPgqvY3UJJQD9mkaoso7cqlDWqmkKAK-BpuelZ12X-vda2b_4kjJIR2tb7J_69lB572MORnyp-5VGDVYHYx'
const url = 'https://api.yelp.com/v3/businesses/search?'



//Routing 
app.get('/', (req, res) => {
    res.render('pages/home')
})


// Create 
app.get('/itinerary/create', (req, res) =>{
    res.render('pages/create')
})

app.post('/itinerary/create', async (req, res) => {
    try {
        const newItem = new itinerary(
            {
                title: req.body.title,
                location: req.body.location,
                description: req.body.description,
                traveler: req.body.traveler,
                theme: req.body.theme,
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
    
    } catch (err) {
    // Error handling if product can't be save
        next(err); 
    }
})

app.post('/itinerary/:id/comment/new', async (req, res, next) => {
    // Data handlers
    const { id } = req.params
    const {person, response } = req.body
    const current = new Date()
    const date = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}`
    console.log(id, person, response, date)

    // Throw error if id is not valid 

    if (!ObjectID.isValid(id)) {
        return next(new AppError('Invalid Id', 400));
    }
    
    const item = await itinerary.findById(id)
    
    if (!item) {
        return next(new AppError('Product not Found', 400));
    }

    // Create comment

    const newComment = new comment({
        name: person,
        date: date,
        comment: response
    })
    let saveComment = await newComment.save()
    item.comments.push(saveComment)
    await item.save()
    res.redirect(`/itinerary/${id}`)
    

})
// Show one item 
app.get('/itinerary/:id', async (req, res, next) => {
    const { id } = req.params;

    // Throw error if id is not valid (else we get a cast error when searching)
    
    if (!ObjectID.isValid(id)) {
        return next(new AppError('Invalid Id', 400));
    }

    let item = await itinerary.findById(id).populate('comments')
    // Throw error if id is not found
    if (!item) {
        return next(new AppError('Product not Found', 400));
    }



    // YELP
    
    await fetch(`https://api.yelp.com/v3/businesses/search?term=food&location=${item.location}&limit=12&sort_by=review_count&radius=10000`, {
        method: 'GET',
        headers: ({
            'Authorization': `Bearer ${apiKey}`        
        })})
        .then(res => {
            return res.json()
        })
        .then(data => {
            item.yelp = data.businesses
        })
        .catch(error => {
            // prevent rendering of yelp option 
            item.yelp = [] 
        })

    
    res.render('pages/view', { item })
})

// Show all
app.get('/itinerary', async (req, res) => {
    try {
    const allItinerary = await itinerary.find({})
    res.render('pages/viewall', { allItinerary })
    } catch(err) {
    next(err)
    }
})



// Delete Item

app.delete('/itinerary/:id', async (req, res) => {
    try {
        const { id } = req.params
        const remove = await itinerary.findByIdAndDelete(id);
        res.redirect('pages/itinerary')
    } catch (err) {
        next(err)
    }

})


// Update
app.get('/itinerary/:id/edit', async (req,res) => {
    try {
        const { id } = req.params
        const item = await itinerary.findById(id)
        res.render('pages/edit', { item })
    } catch(err) {
        next(err)
    }

})

app.put('/itinerary/:id', async(req, res) => {
    try {
        const { id } = req.params
        const updateItem = await itinerary.findByIdAndUpdate(id, {... req.body})
        res.redirect(`pages/itinerary/${id}`)
    } catch(err) {
        next(err)
    }
})

//// Registrations

// Making an account
app.get('/user/new', (req, res) => {
    res.render('pages/user/newuser')
})

app.post('/user/new', async (req, res, next) => {
    try {
        const {login, email, password} = req.body
        const createdUser = new user({email, username: login})
        console.log(createdUser, password)
        const registerUser = await user.register(createdUser, password)
        req.flash('success', `Account creation completed, welcome ${login}`)
        res.redirect('/itinerary') 
    } catch (err) {
        next(err)
    }

})

// Login Process

app.get('/user/login', async (req, res, next) => {
    res.render("pages/user/login")
})

app.post('/user/login', (req, res) => {
    res.send(req.body)
})



/// Set Up and Error Handling

app.use((req, res) => {
    const err = {status: 401, message: 'Page not found'}
    res.render('pages/error', { err })
})

app.use((err, req, res, next) => {
  const {status = 500, message = 'Something went wrong'} = err
  res.status(status).render('pages/error', { err })
  })

app.listen(3000, () => {
     console.log('Port 3000 is working')
})




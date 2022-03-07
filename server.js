//importing modules
const path = require('path')
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

//importing routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const errorController = require('./controllers/error');

const app = express();
const port = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', 'views');

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));
app.use(cookieParser());

//routes
app.use("/auth/", authRoutes);
app.use("/user/", userRoutes);

app.get('/', (req, res, next) => {
    token = req.cookies.token;
    if (!token) {
        res.redirect('auth/login');
    } else {
         res.redirect('user/profile');
    }
});


//500 error route
app.get('/500', errorController.get500);

//404 error route
app.use(errorController.get404);

//error handling
app.use((error, req, res, next) => {
    res.redirect('/500')
});


mongoose
    .connect(
        process.env.MONGODB_URI
    )
    .then(result => {
        app.listen(port, () => {
            console.log("server running");
        })
    })
    .catch( err => console.log(err));

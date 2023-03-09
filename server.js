const express = require('express');
const app = express()
const session = require('express-session')
const flash = require("express-flash");
const passport = require('passport')
const PORT = process.env.PORT || 4000;
const initializePassport = require("./config/passportConfig");
const router = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
const passportConfig = require('./config/passportConfig');
const { Pool } = require('./config/dbConfig');
const dotenv = require('dotenv');


dotenv.config();

// Configuración de body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



//initializations

app.set('views', __dirname + '/views');
app.use(express.static('public'));

initializePassport(passport);
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  saveUntialized: false,
  resave: false,
  cookie: {
    sameSite: 'lax' // 
  }

}));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());



//Rutas
app.use(require('./routes/userRoutes'))


//Server
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});

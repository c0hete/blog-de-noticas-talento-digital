const express = require('express');
const app = express()
const session = require('express-session')
const flash = require("express-flash");
const passport = require('passport')
const PORT = process.env.PORT || 4000;
const initizalizePassport = require("./config/passportConfig");


//initializations
app.set('views', __dirname + '/views');
app.use(express.static('public'));

initizalizePassport(passport);
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(session({
  secret: 'secret',
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

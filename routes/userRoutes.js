const { Router } = require("express");
const { pool } = require("../config/dbConfig");
const bcrypt = require("bcrypt");
const path = require("path");
const router = Router();
const passport = require("passport");
const multer = require("multer");

//MULTER
// Definir el almacenamiento para los archivos cargados
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".").pop()
    ); // crear un nombre único para el archivo
  },
});
// Configurar multer
const upload = multer({ storage: storage });



router.get("/", (req, res) => {
  res.render("index");
});

router.get("/users/login", (req, res) => res.render("login"));

router.get("/users/register", (req, res) => res.render("register"));

router.get("/users/dashboard", (req, res) =>
  res.render("dashboard", { user: req.user.name })
);

router.get("/users/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.render("index", { message: "You have logged out successfully" });
  });
});

router.post("/users/register", async (req,res) => {
    let { name, email, password, password2 } = req.body;
  
    console.log({
      name,
      email,
      password,
      password2
    });
  
    let errors = [];
  
    if(!name || !email || !password || !password2){
      errors.push({ message:"Please enter all fields"});
  
    }
  
    if (password.length < 6){
      errors.push({message: "Passwords should be at least 6 characters"});
    }
  
    if (password != password2){
      errors.push({message:"Passwords do not match"});
    }
  
    if(errors.length > 0){
      res.render('register',{ errors });
    }else{
      //form validation has passed
      
      let hashedPassword = await bcrypt.hash(password,10);
      console.log(hashedPassword);
      
      pool.query(
        `SELECT * FROM users
        WHERE email = $1`, 
        [email],
        (err, results)=>{
          if (err){
            throw err;
          }
        
          console.log(results.rows);
          if(results.rows.length > 0 ){
            errors.push({message: "Email already registered"})
            res.render('register', {errors});
          }else{
            pool.query(
              `INSERT INTO users (name, email, password)
              VALUES ($1, $2, $3)
              RETURNING id, password`,[name, email, hashedPassword], 
              (err, results)=>{
                if (err){
                  throw err
                }
                console.log(results.rows)
                req.flash('success_msg', "You are now registered. Please log in");
                res.redirect('/users/login');
              }
            )
          }
        }
      );
    }
  });

router.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

module.exports = router;

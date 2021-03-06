//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/usersDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundItem){
    if (err) {
      console.log(err);
    }
    else {
      if (foundItem.password === password){
        res.render("secrets");
      }
    }
  });
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });

  user.save(function(err){
    if (err) {
      console.log(err);
    }
    else {
      res.render("secrets");
    }
  });
});

app.get("/secret", function(req, res){
  res.render("secret");
});

app.get("/submit", function(req, res){
  res.render("submit");
});


app.listen(3000, function(){
  console.log("Server started on port 3000");
});

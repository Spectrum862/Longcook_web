const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();
  
  app.use("/views/partials",express.static("partials"));
  app.use("/CSS",express.static("CSS"));
  app.use("/img",express.static("img"));
  app.use("/js",express.static("js"));
  app.use("/slick",express.static("slick"));
  app.set('view engine', 'ejs');

  app.get("/login",function(req,res){
    res.render("Login");
  });

  app.get("/signup",function(req,res){
    res.render("Signup");
  });

  app.get("/",function(req,res){
    res.render("home");
  });

  app.get("/Recipelist",function(req,res){
    res.render("list");
  });

  app.post("/search",function(req,res){

  });

  app.post("/authen",function(req,res){
    
  });


  
  
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

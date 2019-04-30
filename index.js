const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
  
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', path.join(__dirname, 'views'));
  app.use("/CSS",express.static("CSS"));
  app.set('view engine', 'ejs');


  app.get("/login",function(req,res){
    res.render("login");
  });

  app.get("/signup",function(req,res){
    res.render("Signup");
  });
  
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

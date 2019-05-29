let express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    blog                  = require("./models/blog"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
    mongoose.connect("mongodb+srv://longcook:4GydohZ3YWVjKG9L@cluster0-yxot1.mongodb.net/longcook");
    const PORT = process.env.PORT || 5000;
    const app = express();
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(require("express-session")({
        secret: "longcook",
        resave: false,
        saveUninitialized: false
    }));

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  
  app.use("/views/partials",express.static("partials"));
  app.use("/CSS",express.static("CSS"));
  app.use("/img",express.static("img"));
  app.use("/js",express.static("js"));
  app.use("/slick",express.static("slick"));
  app.use("/views/partials/nav",express.static("nav"));
  app.set('view engine', 'ejs');

  app.get("/login",function(req,res){
    res.render("Login");
  });
  
  app.get("/",function(req,res){
    if(req.isAuthenticated()){
      res.render("home",{authen:true,name:req.user.name});
    }
    else res.render("home",{authen:false});

  });
  

  app.get("/recipelist",function(req,res){

    blog.find().then(function(blogfetch){
      if(req.isAuthenticated()){
        res.render("list",{authen:true,name:req.user.name, blog:blogfetch});
      }
      else res.render("list",{authen:false,blog:blogfetch});
    })
    
  });

  app.get("/addrecipe",isLoggedIn,function(req,res){
    if(req.isAuthenticated()){
      res.render("addrecipe",{authen:true,name:req.user.name});
    }
    else res.render("addrecipe",{authen:false});
  });

  app.post("/addrecipe",function(req,res){
    console.log("insert");
    let newblog = new blog({  title: req.body.title,  
                              type:req.body.type,  
                              ingredients:req.body.ingredients,  
                              howto:req.body.howto,
                              owner:req.user.id,
                              ownername:req.user.name,
                              pfimg:req.user.pfimg,
                              des:req.body.des,
                              img:req.body.img
                            })  
    newblog.save(function (err, blog) {
      if (err) return console.error(err);
      console.log(newblog.title + " saved to recipe collection.");
    });
    res.redirect("/");
  });

  app.post("/search",function(req,res){

  });


  // Auth Routes

  //show sign up form
  app.get("/signup", function(req, res){
    res.render("Signup"); 
  });
  //handling user sign up
  app.post("/register", function(req, res){
      User.register(new User({username: req.body.username, name:req.body.name, gender:req.body.gender, pfimg:req.body.profileimg}), req.body.password,function(err, user){
          if(err){
              console.log(err);
              return res.render('Signup');
          }
          passport.authenticate("local")(req, res, function(){
            res.redirect("/");
          });
      });
  });

  // LOGIN ROUTES
  //render login form
  app.get("/login", function(req, res){
    res.render("Login"); 
  });
  //login logic
  //middleware
  app.post("/login", passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/Login"
  }) ,function(req, res){
  });

  app.get("/logout", function(req, res){
      req.logout();
      res.redirect("/");
  });


  function isLoggedIn(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      res.redirect("/Login");
  }

  
  
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

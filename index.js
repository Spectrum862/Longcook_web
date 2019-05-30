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
  
  app.get("/mymenu",isLoggedIn,function(req,res){
    blog.find({owner:req.user.id}).then(function(blogfetch){
      if(req.isAuthenticated()){
        res.render("mymenu",{authen:true,name:req.user.name, blog:blogfetch});
      }
    });
  });

  app.get("/menu/:id",function(req,res){
    console.log(req.params.id);
    blog.findOne({_id:req.params.id}).then(function(blogfetch){
      if(req.isAuthenticated()){
        res.render("menu",{authen:true,name:req.user.name, blog:blogfetch,ownerid:req.user.id});
      }
      else res.render("menu",{authen:false,blog:blogfetch});
    });
  });

  app.get("/recipelist",function(req,res){
    blog.find().then(function(blogfetch){
      if(req.isAuthenticated()){
        res.render("list",{authen:true,name:req.user.name, blog:blogfetch});
      }
      else res.render("list",{authen:false,blog:blogfetch});
    })
  });

  app.get("/recipelist/:filter",function(req,res){
    blog.find({type:req.params.filter}).then(function(blogfetch){
      if(req.isAuthenticated()){
        res.render("list",{authen:true,name:req.user.name, blog:blogfetch});
      }
      else res.render("list",{authen:false,blog:blogfetch});
    })
  });

  app.get("/addrecipe",isLoggedIn,function(req,res){
      res.render("addrecipe",{authen:true,name:req.user.name});
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

  app.get("/edit/:id",isLoggedIn,function(req,res){
      res.render("edit",{authen:true,name:req.user.name,blogid:req.params.id});
  });

  app.post("/edit/:id",isLoggedIn,function(req,res){
    console.log("to edit");
    let query = {id:req.params.id};
    blog.findOne({_id:req.params.id}).then(function(blogfetch){
      console.log(query);
      let newtitle;
      if(req.body.title) newtitle = req.body.title;
      else newtitle = blogfetch.title;
      
      let newtype;
      if(req.body.type) newtitle = req.body.type;
      else newtype = blogfetch.type;

      let newingredients;
      if(req.body.ingredients) newingredients = req.body.ingredients;
      else newingredients = blogfetch.ingredients;

      let newhowto;
      if(req.body.howto) newhowto = req.body.howto;
      else newhowto = blogfetch.howto;

      let newdes;
      if(req.body.des) newdes = req.body.des;
      else newdes = blogfetch.des;

      let newimg;
      if(req.body.img){
        console.log("to loop");
        newimg = req.body.img;
      } 
      else newimg = blogfetch.img;
      blogfetch.updateOne({  
                              title: newtitle,  
                              type:newtype,  
                              ingredients:newingredients,  
                              howto:newhowto,
                              owner:req.user.id,
                              ownername:req.user.name,
                              pfimg:req.user.pfimg,
                              des:newdes,
                              img:newimg
      }, function (err) {
          if (err) {
              console.log(err);
              return;
          } else {
              res.redirect("/"); //wrong route
          }
      });      
    });
  });

  app.get("/delete/:id", function(req, res){
    blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/recipelist");
        } else {
            res.redirect("/recipelist");
        }
    })
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

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .use("/CSS",express.static("CSS"))
  .set('view engine', 'ejs')

  .get("/",function(req,res){
    res.render("login");
  })
  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

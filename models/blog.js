let mongoose = require("mongoose");

let blogSchema = new mongoose.Schema({
    owner: String,
    ownername : String,
    img: String,
    pfimg: String,
    title: String,
    des:String,
    type: String,
    ingredients: String,
    longflag: {type: Boolean, default: false},
    howto: String,
    like: {type: Number,default:0},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("blog", blogSchema);
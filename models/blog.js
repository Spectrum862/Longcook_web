let mongoose = require("mongoose");

let blogSchema = new mongoose.Schema({
    owner: Object,
    title: String,
    type: String,
    ingredients: String,
    loogflag: {type: Boolean, default: false},
    howto: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("blog", blogSchema);
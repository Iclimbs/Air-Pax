const mongoose = require("mongoose");
const popularSchema = mongoose.Schema({
    place: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    CreatedAt: { type: Date, default: Date.now },
});
const PopularBlogModel = mongoose.model("PopularBlog", popularSchema)
module.exports = { PopularBlogModel };
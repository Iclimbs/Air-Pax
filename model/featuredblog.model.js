const mongoose = require("mongoose");
const featuredSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    status: {
        type: Boolean,
        default: true
    },
    CreatedAt: { type: Date, default: Date.now },
});
const FeaturedBlogModel = mongoose.model("FeaturedBlog", featuredSchema)
module.exports = { FeaturedBlogModel };
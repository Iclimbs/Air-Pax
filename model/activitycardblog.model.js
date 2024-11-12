const mongoose = require("mongoose");
const Schema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    activity: {
        type: Array,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    CreatedAt: { type: Date, default: Date.now },
});
const ActivityCardBlogModel = mongoose.model("ActivityCardBlog", Schema)
module.exports = { ActivityCardBlogModel };
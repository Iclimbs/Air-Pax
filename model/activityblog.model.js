const mongoose = require("mongoose");
const activitySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tour: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    CreatedAt: { type: Date, default: Date.now },
});
const ActivityBlogModel = mongoose.model("ActivityBlog", activitySchema)
module.exports = { ActivityBlogModel };
const mongoose = require("mongoose");
const activitySchema = mongoose.Schema({
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
    status: {
        type: Boolean,
        default: true
    },
    CreatedAt: { type: Date, default: Date.now },
});
const ActivityCardBlogModel = mongoose.model("ActivityCardBlog", activitySchema)
module.exports = { ActivityCardBlogModel };
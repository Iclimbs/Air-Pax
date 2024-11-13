require('dotenv').config()
const express = require("express")
const { FeaturedBlogModel } = require('../model/featuredblog.model')
const BlogRouter = express.Router()
const multer = require("multer");
const path = require('node:path');
const { PopularBlogModel } = require('../model/popularblog.model');
const { ActivityCardBlogModel } = require('../model/activitycardblog.model');
const { ActivityBlogModel } = require('../model/activityblog.model');
const uploadPath = path.join(__dirname, "../public/");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        let uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

const upload = multer({ storage: storage });


// Popular Blog Routes

BlogRouter.post("/popularblog/add", upload.single("img"), async (req, res) => {
    const { title, place } = req.body;
    const fileName = req.file.filename;
    try {
        const newpopularblog = new PopularBlogModel({ title, place, img: fileName })
        await newpopularblog.save()
        res.json({ status: "success", message: "New Popular Blog Added !!" })
    } catch (error) {
        res.json({ status: "error", message: `Failed To Add New Blog ${error.message}` })
    }
})

BlogRouter.patch("/popularblog/edit/:id",upload.single("img"), async (req, res) => {
    const { id } = req.params
    try {
        const popularblog = await PopularBlogModel.findByIdAndUpdate({ _id: id }, req.body)
        await popularblog.save()
        res.json({ status: "success", message: "Popular Blog Details Successfully Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: `Failed To Update Popular Blog Item Details ${error.message}` })
    }
})

BlogRouter.patch("/popularblog/disable/:id", async (req, res) => {
    const { id } = req.params
    try {
        const popularblog = await PopularBlogModel.findById({ _id: id })
        popularblog.status = !popularblog.status;
        await popularblog.save()
        res.json({ status: "success", message: "Food Item Availability Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Update Food Item Availability Details" })
    }
})

BlogRouter.get("/popularblog/listall", async (req, res) => {
    try {
        const popularBlogList = await PopularBlogModel.find({})
        res.json({ status: "success", data: popularBlogList })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})

BlogRouter.get("/popularblog/listall/active", async (req, res) => {
    try {
        const popularBlogList = await PopularBlogModel.find({ status: true })
        res.json({ status: "success", data: popularBlogList })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})


// Activity Card Blog Routes

BlogRouter.post("/activitycardblog/add", upload.single("img"), async (req, res) => {
    const { title, activity } = req.body;
    const fileName = req.file.filename;
    try {
        const newactivitycardblog = new ActivityCardBlogModel({ title, img: fileName, activity })
        await newactivitycardblog.save()
        res.json({ status: "success", message: "New Activity Blog Added !!" })
    } catch (error) {
        res.json({ status: "error", message: `Failed To Add New Activity Blog ${error.message}` })
    }
})

BlogRouter.patch("/activitycardblog/edit/:id", async (req, res) => {
    const { id } = req.params
    try {
        const activitycardblog = await ActivityCardBlogModel.findByIdAndUpdate({ _id: id }, req.body)
        await activitycardblog.save()
        res.json({ status: "success", message: "Activity Card Details Successfully Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: `Failed To Update Activity Card Details ${error.message}` })
    }
})


BlogRouter.patch("/activitycardblog/disable/:id", async (req, res) => {
    const { id } = req.params
    try {
        const activityblog = await ActivityCardBlogModel.findById({ _id: id })
        activityblog.available = !activityblog.available;
        await activityblog.save()
        res.json({ status: "success", message: "Activity Card Availability Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Update Activity Card" })
    }
})


BlogRouter.get("/activitycardblog/listall", async (req, res) => {
    try {
        const foodList = await ActivityCardBlogModel.find()
        res.json({ status: "success", data: foodList })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})

BlogRouter.get("/activitycardblog/listall/active", async (req, res) => {
    try {
        const activityCardList = await ActivityCardBlogModel.find({ status: true })
        res.json({ status: "success", data: activityCardList })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})

// Activity Blog Routes

BlogRouter.post("/activity/add", upload.single("img"), async (req, res) => {
    const { title, tour } = req.body;
    const fileName = req.file.filename;
    try {
        const newactivityblog = new ActivityBlogModel({ title, img: fileName, tour })
        await newactivityblog.save()
        res.json({ status: "success", message: "New Activity Blog Added !!" })
    } catch (error) {
        res.json({ status: "error", message: `Failed To Add New Activity Blog ${error.message}` })
    }
})

BlogRouter.patch("/activity/edit/:id", async (req, res) => {
    const { id } = req.params
    try {
        const activityblog = await ActivityBlogModel.findByIdAndUpdate({ _id: id }, req.body)
        await activityblog.save()
        res.json({ status: "success", message: "Food Item Details Successfully Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: `Failed To Update Activity Blog Details ${error.message}` })
    }
})


BlogRouter.patch("/activity/disable/:id", async (req, res) => {
    const { id } = req.params
    try {
        const activityblog = await ActivityBlogModel.findById({ _id: id })
        activityblog.status = !activityblog.status;
        await activityblog.save()
        res.json({ status: "success", message: "Food Item Availability Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Update Food Item Availability Details" })
    }
})


BlogRouter.get("/activity/listall", async (req, res) => {
    try {
        const foodList = await FoodModel.find()
        res.json({ status: "success", data: foodList })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})

BlogRouter.get("/activity/listall/active", async (req, res) => {
    try {
        const activityCardList = await ActivityCardBlogModel.find({ status: true })
        res.json({ status: "success", data: activityCardList })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})


// Feature Blog Routes

BlogRouter.post("/featuredblog/add", upload.single("img"), async (req, res) => {
    const { title } = req.body;
    const fileName = req.file.filename;
    try {
        const newfeaturedblog = new FeaturedBlogModel({ title, img: fileName })
        await newfeaturedblog.save()
        res.json({ status: "success", message: "New Featured Blog Added !!" })
    } catch (error) {
        res.json({ status: "error", message: `Failed To Add New Blog ${error.message}` })
    }
})

BlogRouter.patch("/featuredblog/edit/:id", async (req, res) => {
    const { id } = req.params
    try {
        const featuredList = await FeaturedBlogModel.findByIdAndUpdate({ _id: id }, req.body)
        await featuredList.save()
        res.json({ status: "success", message: "Fetured List Item Details Successfully Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: `Failed To Update Food Item Details ${error.message}` })
    }
})


BlogRouter.patch("/featuredblog/disable/:id", async (req, res) => {
    const { id } = req.params
    try {
        const featuredList = await FeaturedBlogModel.findById({ _id: id })
        featuredList.status = !featuredList.status;
        await featuredList.save()
        res.json({ status: "success", message: "Featured List Item Availability Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: `Failed To Update Featured List Item Availability Details ${error.message}` })
    }
})


BlogRouter.get("/featuredblog/listall", async (req, res) => {
    try {
        const featuredList = await FeaturedBlogModel.find()
        res.json({ status: "success", data: featuredList })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})

BlogRouter.get("/featuredblog/listall/active", async (req, res) => {
    try {
        const featuredList = await FeaturedBlogModel.find({ status: true })
        res.json({ status: "success", data: featuredList })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})

module.exports = { BlogRouter }
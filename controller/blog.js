require('dotenv').config()
const express = require("express")
const { FeaturedBlogModel } = require('../model/featuredblog.model')
const BlogRouter = express.Router()
const multer = require("multer");
const path = require('node:path');
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

BlogRouter.post("/add", upload.single("img"), async (req, res) => {
    console.log("Reached here ");
    const { title } = req.body;
    const fileName = req.file.filename;
    console.log("filenname ", req.file);
    console.log("filenname ", req.file.filename);


    try {
        const newfood = new FeaturedBlogModel({ title, img: fileName })
        await newfood.save()
        res.json({ status: "success", message: "New Blog Added !!" })
    } catch (error) {
        console.log(error.message);

        res.json({ status: "error", message: "Failed To Add New Blog" })
    }
})

BlogRouter.patch("/edit/:id", async (req, res) => {
    const { id } = req.params
    try {
        const food = await FoodModel.findByIdAndUpdate({ _id: id }, req.body)
        await food.save()
        res.json({ status: "success", message: "Food Item Details Successfully Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Update Food Item Details" })
    }
})


BlogRouter.patch("/disable/:id", async (req, res) => {
    const { id } = req.params
    try {
        const food = await FoodModel.findById({ _id: id })
        food.available = !food.available;
        await food.save()
        res.json({ status: "success", message: "Food Item Availability Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Update Food Item Availability Details" })
    }
})


BlogRouter.get("/listall", async (req, res) => {
    try {
        const foodList = await FoodModel.find()
        res.json({ status: "success", data: foodList })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})

module.exports = { BlogRouter }
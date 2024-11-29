require("dotenv").config();
const express = require("express");
const { FeaturedBlogModel } = require("../model/featuredblog.model");
const BlogRouter = express.Router();
const multer = require("multer");
const path = require("node:path");
const { PopularBlogModel } = require("../model/popularblog.model");
const { ActivityCardBlogModel } = require("../model/activitycardblog.model");
const { ActivityBlogModel } = require("../model/activityblog.model");
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
    const newpopularblog = new PopularBlogModel({
      title,
      place,
      img: fileName,
    });
    await newpopularblog.save();
    res.json({ status: "success", message: "New Popular Blog Added !!" });
  } catch (error) {
    res.json({
      status: "error",
      message: `Failed To Add New Popular Blog ${error.message}`,
    });
  }
});

BlogRouter.patch(
  "/popularblog/edit/:id",
  upload.single("img"),
  async (req, res) => {
    const { id } = req.params;
    const { title, place } = req.body;
    const fileName = req.file.filename;

    try {
      const popularblog = await PopularBlogModel.find(
        { _id: id });
        console.log("popular blog ",popularblog);
        
        popularblog[0].title=title,
        popularblog[0].place=place
        popularblog[0].img=fileName
      await popularblog[0].save();
      res.json({
        status: "success",
        message: "Popular Blog Details Successfully Updated !!",
      });
    } catch (error) {
      res.json({
        status: "error",
        message: `Failed To Update Popular Blog Item Details ${error.message}`,
      });
    }
  }
);

BlogRouter.patch("/popularblog/disable/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const popularblog = await PopularBlogModel.findById({ _id: id });
    popularblog.status = !popularblog.status;
    await popularblog.save();
    res.json({
      status: "success",
      message: "Popular Blog Item Availability Updated !!",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: `Failed To Update Popular Blog Item Availability ${error.message}`,
    });
  }
});

BlogRouter.get("/popularblog/listall", async (req, res) => {
  try {
    const popularBlogList = await PopularBlogModel.find({});
    if (popularBlogList.length !== 0) {
      res.json({ status: "success", data: popularBlogList });
    } else {
      res.json({
        status: "error",
        message: "No Blog Found In Popular Seaction",
      });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `Failed To Get Popular Blog List ${error.message}`,
    });
  }
});

BlogRouter.get("/popularblog/listall/active", async (req, res) => {
  try {
    const popularBlogList = await PopularBlogModel.find({ status: true });
    if (popularBlogList.length !== 0) {
      res.json({ status: "success", data: popularBlogList });
    } else {
      res.json({
        status: "error",
        message: "No Active Blog Found In Popular Seaction",
      });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `Failed To Get Active Popular Blog List ${error.message}`,
    });
  }
});

// Activity Card Blog Routes

BlogRouter.post(
  "/activitycardblog/add",
  upload.single("img"),
  async (req, res) => {
    const { title, activity } = req.body;
    const fileName = req.file.filename;
    try {
      const newactivitycardblog = new ActivityCardBlogModel({
        title,
        img: fileName,
        activity,
      });
      await newactivitycardblog.save();
      res.json({ status: "success", message: "New Activity Blog Added !!" });
    } catch (error) {
      res.json({
        status: "error",
        message: `Failed To Add New Activity Blog ${error.message}`,
      });
    }
  }
);

BlogRouter.patch(
  "/activitycardblog/edit/:id",
  upload.single("img"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const activitycardblog = await ActivityCardBlogModel.findByIdAndUpdate(
        { _id: id },
        req.body
      );
      await activitycardblog.save();
      res.json({
        status: "success",
        message: "Activity Card Details Successfully Updated !!",
      });
    } catch (error) {
      res.json({
        status: "error",
        message: `Failed To Update Activity Card Details ${error.message}`,
      });
    }
  }
);

BlogRouter.patch("/activitycardblog/disable/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const activityblog = await ActivityCardBlogModel.findById({ _id: id });
    activityblog.status = !activityblog.status;
    await activityblog.save();
    res.json({
      status: "success",
      message: "Activity Card Availability Updated !!",
    });
  } catch (error) {
    res.json({ status: "error", message: "Failed To Update Activity Card" });
  }
});

BlogRouter.get("/activitycardblog/listall", async (req, res) => {
  try {
    const activityCardList = await ActivityCardBlogModel.find();
    if (activityCardList.length !== 0) {
      res.json({ status: "success", data: activityCardList });
    } else {
      res.json({
        status: "error",
        message: "No Blog Found In Activity Seaction",
      });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `Failed To Get Activity Blog List ${error.message}`,
    });
  }
});

BlogRouter.get("/activitycardblog/listall/active", async (req, res) => {
  try {
    const activityCardList = await ActivityCardBlogModel.find({ status: true });
    if (activityCardList.length !== 0) {
      res.json({ status: "success", data: activityCardList });
    } else {
      res.json({
        status: "error",
        message: "No Active Blog Found In Activity Seaction",
      });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `Failed To Get Activity Blog List ${error.message}`,
    });
  }
});

// Activity Blog Routes

BlogRouter.post("/activity/add", upload.single("img"), async (req, res) => {
  const { title, tour } = req.body;
  const fileName = req.file.filename;
  try {
    const newactivityblog = new ActivityBlogModel({
      title,
      img: fileName,
      tour,
    });
    await newactivityblog.save();
    res.json({ status: "success", message: "New Activity Blog Added !!" });
  } catch (error) {
    res.json({
      status: "error",
      message: `Failed To Add New Activity Blog ${error.message}`,
    });
  }
});

BlogRouter.patch(
  "/activity/edit/:id",
  upload.single("img"),
  async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    console.log();

    try {
      const activityblog = await ActivityBlogModel.findByIdAndUpdate(
        { _id: id },
        req.body
      );
      await activityblog.save();
      res.json({
        status: "success",
        message: "Activity Details Successfully Updated !!",
      });
    } catch (error) {
      res.json({
        status: "error",
        message: `Failed To Update Activity Blog Details ${error.message}`,
      });
    }
  }
);

BlogRouter.patch("/activity/disable/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const activityblog = await ActivityBlogModel.findById({ _id: id });
    activityblog.status = !activityblog.status;
    await activityblog.save();
    res.json({
      status: "success",
      message: "Activity Details Availability Updated !!",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: `Failed To Update Food Item Availability Details ${error.message}`,
    });
  }
});

BlogRouter.get("/activity/listall", async (req, res) => {
  try {
    const activityList = await ActivityBlogModel.find();
    if (activityList.length > 0) {
      res.json({ status: "success", data: activityList });
    } else {
      res.json({
        status: "error",
        message: "No Blog Found in Activity Section",
      });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `Failed To Get Activity List ${error.message}`,
    });
  }
});

BlogRouter.get("/activity/listall/active", async (req, res) => {
  try {
    const activityList = await ActivityBlogModel.find({ status: true });
    if (activityList.length > 0) {
      res.json({ status: "success", data: activityList });
    } else {
      res.json({
        status: "error",
        message: "No Active Blog Found in Activity Section",
      });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `Failed To Get Active Activity List ${error.message}`,
    });
  }
});

// Feature Blog Routes

BlogRouter.post("/featuredblog/add", upload.single("img"), async (req, res) => {
  const { title } = req.body;
  const fileName = req.file.filename;
  try {
    const newfeaturedblog = new FeaturedBlogModel({ title, img: fileName });
    await newfeaturedblog.save();
    res.json({ status: "success", message: "New Featured Blog Added !!" });
  } catch (error) {
    res.json({
      status: "error",
      message: `Failed To Add New Blog ${error.message}`,
    });
  }
});

BlogRouter.patch(
  "/featuredblog/edit/:id",
  upload.single("img"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const featuredList = await FeaturedBlogModel.findByIdAndUpdate(
        { _id: id },
        req.body
      );
      await featuredList.save();
      res.json({
        status: "success",
        message: "Fetured List Item Details Successfully Updated !!",
      });
    } catch (error) {
      res.json({
        status: "error",
        message: `Failed To Update Food Item Details ${error.message}`,
      });
    }
  }
);

BlogRouter.patch("/featuredblog/disable/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const featuredList = await FeaturedBlogModel.findById({ _id: id });
    featuredList.status = !featuredList.status;
    await featuredList.save();
    res.json({
      status: "success",
      message: "Featured List Item Availability Updated !!",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: `Failed To Update Featured List Item Availability Details ${error.message}`,
    });
  }
});

BlogRouter.get("/featuredblog/listall", async (req, res) => {
  try {
    const featuredList = await FeaturedBlogModel.find();
    if (featuredList.length > 0) {
      res.json({ status: "success", data: featuredList });
    } else {
      res.json({
        status: "error",
        message: "No Featured Blog Found in Featured Section",
      });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `Failed To Get Featured List Item Details ${error.message}`,
    });
  }
});

BlogRouter.get("/featuredblog/listall/active", async (req, res) => {
  try {
    const featuredList = await FeaturedBlogModel.find({ status: true });
    if (featuredList.length > 0) {
      res.json({ status: "success", data: featuredList });
    } else {
      res.json({
        status: "error",
        message: "No Active Featured Blog Found in Featured Section",
      });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `Failed To Get Active Featured List Item Details ${error.message}`,
    });
  }
});

module.exports = { BlogRouter };

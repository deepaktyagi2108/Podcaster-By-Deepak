const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const Podcast = require("../models/podcast");
const Category = require("../models/category");
const User = require("../models/user");

router.post("/add-podcast", authMiddleware, upload, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const frontImage = req.files?.["frontImage"]?.[0]?.path;
    const audioFile = req.files?.["audioFile"]?.[0]?.path;

    // Validate all fields
    if (!title || !description || !category || !frontImage || !audioFile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { user } = req;

    // Validate category existence
    const cat = await Category.findOne({
      categoryName: { $regex: `^${category}$`, $options: "i" },
    });

    if (!cat) {
      return res.status(400).json({ message: "No category found" });
    }

    // Check for duplicate frontImage or audioFile
    const existingPodcast = await Podcast.findOne({
      $or: [{ frontImage }, { audioFile }],
    });

    if (existingPodcast) {
      return res.status(400).json({
        message:
          existingPodcast.frontImage === frontImage
            ? "A podcast with the same front image already exists."
            : "A podcast with the same audio file already exists.",
      });
    }

    
    const newPodcast = new Podcast({
      title,
      description,
      category: cat._id,
      frontImage,
      audioFile,
      user: user._id,
    });

    await newPodcast.save();

    await Category.findByIdAndUpdate(cat._id, {
      $push: { podcasts: newPodcast._id },
    });

    await User.findByIdAndUpdate(user._id, {
      $push: { podcasts: newPodcast._id },
    });

    return res.status(201).json({ message: "Podcast added successfully" });

  } catch (error) {
    console.error("Upload Error:", error);

    // Mongoose unique constraint violation
    if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `A podcast with the same ${duplicatedField} already exists.`,
      });
    }

    return res.status(500).json({ message: "Failed to add podcast" });
  }
});
// Get all podcasts (for home or explore page)
router.get("/get-podcasts", async (req, res) => {
  try {
    const podcasts = await Podcast.find({})
      .sort({ createdAt: -1 }) // optional: newest first
      .populate("category")
      .populate("user", "name"); // optional: show user name

    return res.status(200).json({ data: podcasts });
  } catch (error) {
    console.error("Error fetching all podcasts:", error);
    return res.status(500).json({ message: "Failed to fetch podcasts" });
  }
});




        
    

//get podcasts by categories
// router.get("/category/:cat",async(req,res)=>{
//     try {
//         const {cat}=req.params;
//         const categories=await Category.find({categoryName:cat}).populate(
//             {path:"podcasts",
//             populate:{path:"category"}
//         });
//         let podcasts=[];
//         categories.forEach((category)=>{
//             podcasts=[...podcasts,...category.podcasts];
//         })
//         return res.status(200).json({data:podcasts})
//     } catch (error) {
//         return res.status(407).json({message:"Internal server"});
        
//     }
// })
router.get("/category/:cat", async (req, res) => {
  try {
    const { cat } = req.params;

    // Find the category document by categoryName string
    const category = await Category.findOne({ categoryName: cat });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find podcasts where category field equals category._id
    const podcasts = await Podcast.find({ category: category._id }).populate("category");

    return res.status(200).json({ data: podcasts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
//delete podcasts
const fs = require("fs");
const path = require("path");
router.delete("/delete-podcasts/:id",authMiddleware,async(req,res)=>{
  console.log("DELETE route hit");
  try{
    const podcastId=req.params.id
    const podcast=await Podcast.findById(podcastId);
    if(!podcast){
     return  res.status(400).json({message:"Not Found"})
    }
    if(podcast.user.toString()!==req.user._id.toString()){
      return res.status(400).json({message:"Not authorized"})
    }
    if (podcast.audioFile && fs.existsSync(podcast.audioFile)) {
      fs.unlinkSync(podcast.audioFile);
    }
     if (podcast.frontImage && fs.existsSync(podcast.frontImage)) {
      fs.unlinkSync(podcast.frontImage);
    }
    await Category.findByIdAndUpdate(podcast.category, {
      $pull: { podcasts: podcast._id },
    });
    await User.findByIdAndUpdate(podcast.user, {
      $pull: { podcasts: podcast._id },
    });
    await Podcast.findByIdAndDelete(podcastId);
    return res.status(200).json({message:"DEleted Successfully"});
  }
  catch(error){
    console.log("Deleted Error :",error)
    return res.status(400).json({message:"Unable to delete"})
  }
})

// search podcasts by title

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    const results = await Podcast.find({
      title: { $regex: query, $options: "i" },
    }).populate("category");

    res.status(200).json({ data: results });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Failed to search podcasts" });
  }
});
router.get("/get-user-podcasts", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find podcasts belonging to the logged-in user
    const userPodcasts = await Podcast.find({ user: userId }).populate("category");

    return res.status(200).json({ data: userPodcasts });
  } catch (error) {
    console.error("Error fetching user podcasts:", error);
    return res.status(500).json({ message: "Failed to fetch user podcasts" });
  }
});





module.exports=router




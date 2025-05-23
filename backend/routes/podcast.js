
const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const Podcast = require("../models/podcast");
const Category = require("../models/category");
const User = require("../models/user");

// router.post("/add-podcast", authMiddleware, upload, async (req, res) => {
//   try {
//     const { title, description, category } = req.body;

//     const frontImage = req.files?.["frontImage"]?.[0]?.path;
//     const audioFile = req.files?.["audioFile"]?.[0]?.path;

//     if (!title || !description || !category || !frontImage || !audioFile) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const { user } = req;
//     console.log("Received category:", category);
//     const cat = await Category.findOne({ 
     
//       categoryName: { $regex: `^${category}$`, $options: "i" }
//     });

//     if (!cat) {
//       return res.status(400).json({ message: "No category found" });
//     }

//     const newPodcast = new Podcast({
//       title,
//       description,
//       category: cat._id,
//       frontImage,
//       audioFile,
//       user: user._id,
//     });

//     await newPodcast.save();

//     await Category.findByIdAndUpdate(cat._id, {
//       $push: { podcasts: newPodcast._id },
//     });

//     await User.findByIdAndUpdate(user._id, {
//       $push: { podcasts: newPodcast._id },
//     });

//     return res.status(201).json({ message: "Podcast added successfully" });
//   } catch (error) {
//     console.error("Upload Error:", error);
//     return res.status(500).json({ message: "Failed to add podcast" });
//   }
// });
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

    // Create new podcast
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




//get all-podcasts

router.get("/get-podcasts",async(req,res)=>{
    try {
        const podcasts=await Podcast.find().populate("category")
        .sort({createdAt: -1});
        return res.status(200).json({data:podcasts})
    } catch (error) {
        return res.status(407).json({message:"Internal server"});
        
    }
})

//get user specific podcasts
router.get("/get-user-podcasts",authMiddleware,async(req,res)=>{
  console.log("req reached here");
    try {
       const {user}=req
       const userid=user._id;
       const data=await User.findById(userid).populate({path:"podcasts",populate:{path:"category"}
    }).select("-password");
    if(data && data.podcasts){
        data.podcasts.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)
    );
    }
    console.log(data)
        return res.status(200).json({data:data.podcasts })
    } catch (error) {  console.log(error);
        return res.status(407).json({message:"Internal server"});
      
        
    }
})
//podcast-by id
router.get("/get-podcast/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const podcasts = await Podcast.findById(id).populate("category");

    if (!podcasts) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    return res.status(200).json({ data: podcasts });
  } catch (error) {
    console.error("Error in get-podcast/:id route:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

        
    

//get podcasts by categories
router.get("/category/:cat",async(req,res)=>{
    try {
        const {cat}=req.params;
        const categories=await Category.find({categoryName:cat}).populate(
            {path:"podcasts",
            populate:{path:"category"}
        });
        let podcasts=[];
        categories.forEach((category)=>{
            podcasts=[...podcasts,...category.podcasts];
        })
        return res.status(200).json({data:podcasts})
    } catch (error) {
        return res.status(407).json({message:"Internal server"});
        
    }
})


module.exports=router
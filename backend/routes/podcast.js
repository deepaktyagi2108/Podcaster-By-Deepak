const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/multer");
const Podcast = require("../models/podcast");
const Category = require("../models/category");
const cloudinary = require("../utils/cloudinary");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");


router.post("/add-podcast", authMiddleware, upload, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    console.log("📥 Request Body:", req.body);

    const frontImage = req.files?.frontImage?.[0]?.path;
    const frontImagePublicId = req.files?.frontImage?.[0]?.filename;

    const audioFile = req.files?.audioFile?.[0]?.path;
    const audioFilePublicId = req.files?.audioFile?.[0]?.filename;

    if (!title || !description || !category || !frontImage || !audioFile) {
      console.warn("⚠️ Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const { user } = req;
    console.log("👤 Authenticated User:", user._id);

    const cat = await Category.findOne({
      categoryName: { $regex: `^${category}$`, $options: "i" },
    });

    if (!cat) {
      console.warn("❌ No category found for:", category);
      return res.status(400).json({ message: "No category found" });
    }

    const newPodcast = new Podcast({
      title,
      description,
      category: cat._id,
      frontImage,
      frontImagePublicId,
      audioFile,
      audioFilePublicId,
      user: user._id,
    });

    await newPodcast.save();
    console.log("✅ Podcast saved:", newPodcast._id);

    await Category.findByIdAndUpdate(cat._id, {
      $push: { podcasts: newPodcast._id },
    });
    console.log("📁 Podcast added to category:", cat._id);

    await User.findByIdAndUpdate(user._id, {
      $push: { podcasts: newPodcast._id },
    });
    console.log("👤 Podcast added to user:", user._id);

    // ✅ Send confirmation email
    await sendEmail(
      user.email,
      `🎧 Your podcast "${title}" is now live!`,
      `Hi ${user.username || "there"},\n\nYour podcast "${title}" has been successfully uploaded to Podcaster.\n\nThanks for sharing your voice!\n\n🎙️ Podcaster Team`
    );
    console.log("📧 Email sent to:", user.email);

    return res.status(201).json({ message: "Podcast added successfully" });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    return res.status(500).json({ message: "Failed to add podcast" });
  }
});

  

//by categories
router.get("/category/:cat", async (req, res) => {
  try {
    const { cat } = req.params;

    // Find the category document by categoryName string
    const category = await Category.findOne({ categoryName: cat });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const podcasts = await Podcast.find({ category: category._id }).populate(
      "category"
    );

    return res.status(200).json({ data: podcasts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
//delete
const fs = require("fs");
const path = require("path");

router.delete("/delete-podcasts/:id", authMiddleware, async (req, res) => {
  try {
    const podcastId = req.params.id;
    const podcast = await Podcast.findById(podcastId);

    if (!podcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    if (podcast.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Delete from Cloudinary
    if (podcast.frontImagePublicId) {
      await cloudinary.uploader.destroy(podcast.frontImagePublicId);
    }

    if (podcast.audioFilePublicId) {
      await cloudinary.uploader.destroy(podcast.audioFilePublicId, {
        resource_type: "video",
      });
    }

    // Remove podcast references
    await Category.findByIdAndUpdate(podcast.category, {
      $pull: { podcasts: podcast._id },
    });

    await User.findByIdAndUpdate(podcast.user, {
      $pull: { podcasts: podcast._id },
    });

    await Podcast.findByIdAndDelete(podcastId);

    // Send email
    const user = req.user;
    await sendEmail(
      user.email,
      `❌ Podcast "${podcast.title}" Deleted`,
      `Hi ${user.username || "there"},\n\nYour podcast titled "${podcast.title}" has been permanently deleted from Podcaster.\n\nWe're sad to see it go, but we hope you'll continue sharing more amazing content soon! 💬🎙️\n\nRegards,\nThe Podcaster Team`
    );
    console.log("📧 Deletion email sent to:", user.email);

    return res.status(200).json({ message: "Podcast deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ message: "Server error while deleting" });
  }
});


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
//user specific
router.get("/get-user-podcasts",authMiddleware,async (req, res) => {
  console.log("GET /get-user-podcasts called");
  try {
    const userId = req.user._id;

    console.log(userId);

    // Find podcasts belonging to the logged-in user
    const userPodcasts = await Podcast.find({ user: userId }).populate(
      "category"
    );

    return res.status(200).json({ data: userPodcasts });
  } catch (error) {
    console.error("Error fetching user podcasts:", error);
    return res.status(500).json({ message: "Failed to fetch user podcasts" });
  }
});
//search by id
router.get("/get-podcast/:id", async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id).populate("category");

    if (!podcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    return res.status(200).json({ data: podcast });
  } catch (error) {
    console.error("Error fetching podcast:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});
//get all podcast
router.get("/get-podcasts", async (req, res) => {
  try {
    const podcasts = await Podcast.find().populate("category");
    return res.status(200).json({ data: podcasts });
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return res.status(500).json({ message: "Failed to fetch podcasts" });
  }
});

//api for updation
router.put("/update-podcast/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const podcastId = req.params.id;
    const podcast = await Podcast.findById(podcastId);

    if (!podcast) {
      return res.status(404).json({ message: "Podcast Not Found" });
    }

    if (podcast.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!title && !description) {
      return res.status(400).json({ message: "No update fields provided" });
    }

    // Update fields
    podcast.title = title || podcast.title;
    podcast.description = description || podcast.description;
    await podcast.save();

    // Send email to user
    const user = req.user;
    await sendEmail(
      user.email,
      `✏️ Your podcast "${podcast.title}" was updated`,
      `Hi ${user.username || "there"},\n\nGood news! Your podcast titled "${podcast.title}" has been successfully updated.\n\nKeep creating and improving—your voice matters! 🎧✨\n\nCheers,\nThe Podcaster Team`
    );
    console.log("📧 Update email sent to:", user.email);

    res.status(200).json({ message: "Podcast updated", podcast });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;

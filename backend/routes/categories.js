const router = require("express").Router();
const Cat = require("../models/category");

// Add category
router.post("/add-category", async (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const existingCat = await Cat.findOne({ categoryName });
    if (existingCat) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const cat = new Cat({ categoryName });
    await cat.save();

    return res.status(201).json({ message: "Category Added", category: cat });
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(500).json({ message: "Failed to add category" });
  }
});


// router.getPod

// Remove category
router.delete("/remove-category", async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const deletedCat = await Cat.findOneAndDelete({ categoryName });

    if (!deletedCat) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "Category Deleted" });
  } catch (error) {
    console.error("Error removing category:", error);
    return res.status(500).json({ message: "Failed to remove category" });
  }
});

module.exports = router;

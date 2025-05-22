import express from "express"
import Category from "../models/Category.js"

const router = express.Router()

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Create a new category (admin only)
router.post("/", async (req, res) => {
  try {
    const { name, image } = req.body

    // Check if category already exists
    const existingCategory = await Category.findOne({ name })
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" })
    }

    const category = new Category({
      name,
      image,
    })

    await category.save()
    res.status(201).json(category)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update category (admin only)
router.put("/:id", async (req, res) => {
  try {
    const { name, image } = req.body

    // Check if name is already taken by another category
    if (name) {
      const existingCategory = await Category.findOne({ name, _id: { $ne: req.params.id } })
      if (existingCategory) {
        return res.status(400).json({ message: "Category name already exists" })
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, { name, image }, { new: true })

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json(updatedCategory)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete category (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id)

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json({ message: "Category deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

export default router

import Category from "../models/Category.js"

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

import express from "express"
import Product from "../models/Product.js"

const router = express.Router()

// Get all products with optional filtering
router.get("/", async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort } = req.query

    // Build filter object
    const filter = {}

    if (category) {
      filter.category = category
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    // Build sort object
    let sortOption = {}

    switch (sort) {
      case "price-low-high":
        sortOption = { price: 1 }
        break
      case "price-high-low":
        sortOption = { price: -1 }
        break
      case "name-a-z":
        sortOption = { name: 1 }
        break
      case "name-z-a":
        sortOption = { name: -1 }
        break
      default:
        sortOption = { createdAt: -1 } // newest first
    }

    const products = await Product.find(filter).sort(sortOption)
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get featured products
router.get("/featured", async (req, res) => {
  try {
    const featuredProducts = await Product.find({ featured: true }).limit(8)
    res.json(featuredProducts)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get related products
router.get("/related/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4)

    res.json(relatedProducts)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Create a new product (admin only)
router.post("/", async (req, res) => {
  try {
    const { name, description, price, image, category, inStock, featured } = req.body

    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      inStock,
      featured,
    })

    await product.save()
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update product (admin only)
router.put("/:id", async (req, res) => {
  try {
    const { name, description, price, image, category, inStock, featured } = req.body

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        image,
        category,
        inStock,
        featured,
      },
      { new: true },
    )

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(updatedProduct)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete product (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

export default router

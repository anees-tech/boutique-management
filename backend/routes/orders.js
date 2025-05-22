import express from "express"
import Order from "../models/Order.js"

const router = express.Router()

// Get all orders (admin only)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod, totalAmount } = req.body

    const order = new Order({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    })

    await order.save()
    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get orders by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update order status (admin only)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body

    if (!["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json(updatedOrder)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

export default router

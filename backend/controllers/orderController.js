import Order from "../models/Order.js"

// Create a new order
export const createOrder = async (req, res) => {
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
}

// Get orders by user ID
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

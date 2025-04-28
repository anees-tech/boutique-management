import express from "express"
import User from "../models/User.js"

const router = express.Router()

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update user
router.put("/:id", async (req, res) => {
  try {
    const { name, email } = req.body

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } })
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" })
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true }).select("-password")

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Change password
router.put("/:id/password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Find user
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Verify current password (in a real app, you would compare hashed passwords)
    if (user.password !== currentPassword) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    // Update password
    user.password = newPassword // In a real app, you would hash this password
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

export default router

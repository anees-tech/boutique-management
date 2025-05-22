import express from "express"
import Support from "../models/Support.js"

const router = express.Router()

// Get all support tickets (admin only)
router.get("/", async (req, res) => {
  try {
    const supportTickets = await Support.find().sort({ createdAt: -1 })
    res.json(supportTickets)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Create a new support ticket
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    const supportTicket = new Support({
      name,
      email,
      subject,
      message,
    })

    await supportTicket.save()
    res.status(201).json({ message: "Support ticket created successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update support ticket status (admin only)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body

    if (!["Open", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const updatedTicket = await Support.findByIdAndUpdate(req.params.id, { status }, { new: true })

    if (!updatedTicket) {
      return res.status(404).json({ message: "Support ticket not found" })
    }

    res.json(updatedTicket)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

export default router

import express from "express"
import Support from "../models/Support.js"

const router = express.Router()

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

export default router

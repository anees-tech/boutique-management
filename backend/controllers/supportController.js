import Support from "../models/Support.js"

// Create a new support ticket
export const createSupportTicket = async (req, res) => {
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
}

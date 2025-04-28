"use client"

import { useState } from "react"
import "../styles/Support.css"

function Support({ user }) {
  const [formData, setFormData] = useState({
    name: user ? user.name : "",
    email: user ? user.email : "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("http://localhost:5000/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to send message")
      }

      setSuccess(true)
      setFormData((prev) => ({
        ...prev,
        subject: "",
        message: "",
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="support-page">
      <h1>Customer Support</h1>

      <div className="support-container">
        <div className="support-info">
          <h2>How Can We Help?</h2>
          <p>
            Our customer support team is here to assist you with any questions or concerns you may have. Fill out the
            form and we'll get back to you as soon as possible.
          </p>

          <div className="contact-methods">
            <div className="contact-method">
              <h3>Email</h3>
              <p>support@boutiquefashion.com</p>
            </div>

            <div className="contact-method">
              <h3>Phone</h3>
              <p>+1 (123) 456-7890</p>
              <p className="contact-hours">Monday - Friday: 9am - 5pm</p>
            </div>

            <div className="contact-method">
              <h3>Address</h3>
              <p>123 Fashion Street</p>
              <p>Style City, SC 12345</p>
            </div>
          </div>

          <div className="faq-section">
            <h3>Frequently Asked Questions</h3>

            <div className="faq-item">
              <h4>How long does shipping take?</h4>
              <p>
                Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business days
                delivery.
              </p>
            </div>

            <div className="faq-item">
              <h4>What is your return policy?</h4>
              <p>We accept returns within 30 days of purchase. Items must be unworn and in original packaging.</p>
            </div>

            <div className="faq-item">
              <h4>Do you ship internationally?</h4>
              <p>
                Yes, we ship to most countries worldwide. International shipping typically takes 7-14 business days.
              </p>
            </div>
          </div>
        </div>

        <div className="support-form-container">
          <h2>Contact Us</h2>

          {error && <div className="error-message">{error}</div>}

          {success ? (
            <div className="success-message">
              <h3>Thank You!</h3>
              <p>Your message has been sent successfully. We'll get back to you as soon as possible.</p>
              <button className="btn btn-primary" onClick={() => setSuccess(false)}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="support-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Support

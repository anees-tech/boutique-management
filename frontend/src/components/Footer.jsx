import "../styles/Footer.css"

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Boutique Fashion</h3>
          <p>Your one-stop destination for trendy fashion and accessories.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/products">Products</a>
            </li>
            <li>
              <a href="/support">Support</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: contact@boutiquefashion.com</p>
          <p>Phone: +1 (123) 456-7890</p>
          <p>Address: 123 Fashion Street, Style City</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Boutique Fashion. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

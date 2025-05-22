import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
// Import other models like Order, Support if you want to seed them too

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/boutique";

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    // await Order.deleteMany({});
    // await Support.deleteMany({});
    console.log("Existing data cleared.");

    // --- Seed Users ---
    const users = await User.insertMany([
      { name: "Admin User", email: "admin@example.com", password: "password123", role: "admin" },
      { name: "Test User", email: "user@example.com", password: "password123", role: "user" },
    ]);
    console.log("Users seeded.");

    const adminUser = users.find(user => user.role === 'admin');
    const regularUser = users.find(user => user.role === 'user');

    // --- Seed Categories ---
    const categories = await Category.insertMany([
      { name: "Electronics", image: "/images/categories/electronics.jpg" },
      { name: "Books", image: "/images/categories/books.jpg" },
      { name: "Clothing", image: "/images/categories/clothing.jpg" },
      { name: "Home & Kitchen", image: "/images/categories/home-kitchen.jpg" },
    ]);
    console.log("Categories seeded.");

    // --- Seed Products ---
    const products = await Product.insertMany([
      {
        name: "Laptop Pro 15 inch",
        description: "High-performance laptop for professionals.",
        price: 1299.99,
        image: "/images/products/laptop-pro.jpg",
        category: categories[0].name, // Electronics
        inStock: true,
        featured: true,
      },
      {
        name: "Wireless Headphones",
        description: "Noise-cancelling over-ear headphones.",
        price: 199.99,
        image: "/images/products/headphones.jpg",
        category: categories[0].name, // Electronics
        inStock: true,
        featured: false,
      },
      {
        name: "The Great Novel",
        description: "A captivating story of adventure and discovery.",
        price: 15.99,
        image: "/images/products/great-novel.jpg",
        category: categories[1].name, // Books
        inStock: true,
        featured: true,
      },
      {
        name: "Men's T-Shirt",
        description: "Comfortable cotton t-shirt.",
        price: 25.00,
        image: "/images/products/tshirt-men.jpg",
        category: categories[2].name, // Clothing
        inStock: false,
        featured: false,
      },
      {
        name: "Coffee Maker",
        description: "Drip coffee maker with 12-cup capacity.",
        price: 49.99,
        image: "/images/products/coffee-maker.jpg",
        category: categories[3].name, // Home & Kitchen
        inStock: true,
        featured: false,
      },
    ]);
    console.log("Products seeded.");

    // --- Seed Orders (Example) ---
    // if (regularUser && products.length > 1) {
    //   await Order.insertMany([
    //     {
    //       userId: regularUser._id,
    //       items: [
    //         { productId: products[0]._id, name: products[0].name, price: products[0].price, quantity: 1 },
    //         { productId: products[1]._id, name: products[1].name, price: products[1].price, quantity: 2 },
    //       ],
    //       shippingAddress: {
    //         fullName: "Test User",
    //         address: "123 Main St",
    //         city: "Anytown",
    //         state: "CA",
    //         zipCode: "90210",
    //         country: "USA",
    //       },
    //       paymentMethod: "Credit Card",
    //       totalAmount: products[0].price * 1 + products[1].price * 2,
    //       status: "Pending",
    //     },
    //   ]);
    //   console.log("Orders seeded.");
    // }

    // --- Seed Support Tickets (Example) ---
    // await Support.insertMany([
    //   {
    //     name: "Test User",
    //     email: "user@example.com",
    //     subject: "Issue with my order",
    //     message: "I haven't received my order yet.",
    //     status: "Open",
    //   },
    // ]);
    // console.log("Support tickets seeded.");

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
};

seedDB();
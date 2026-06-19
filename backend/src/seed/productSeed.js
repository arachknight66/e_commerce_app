import mongoose from "mongoose";
import dns from "node:dns";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const baseUrl = process.env.API_URL || "http://localhost:5000";

const products = [
    {
        name: "iPhone 15 Pro",
        description: "Apple's most powerful iPhone with A17 Pro chip, titanium design, and a 48MP camera system.",
        price: 999.99,
        images: [`${baseUrl}/public/images/products/iphone15.jpg`],
        category: "Electronics",
        brand: "Apple",
        rating: 4.8,
        numReviews: 245,
        stock: 50,
        isFeatured: true,
    },
    {
        name: "Samsung 4K Smart TV 55\"",
        description: "Crystal clear 4K display with built-in streaming apps and smart home integration.",
        price: 749.99,
        images: [`${baseUrl}/public/images/products/samsung_tv.jpg`],
        category: "Electronics",
        brand: "Samsung",
        rating: 4.5,
        numReviews: 189,
        stock: 30,
        isFeatured: true,
    },
    {
        name: "Sony WH-1000XM5 Headphones",
        description: "Industry-leading noise cancellation with up to 30 hours battery life.",
        price: 349.99,
        images: [`${baseUrl}/public/images/products/sony_headphones.jpg`],
        category: "Electronics",
        brand: "Sony",
        rating: 4.7,
        numReviews: 312,
        stock: 75,
        isFeatured: true,
    },
    {
        name: "Nike Air Max 270",
        description: "Lightweight running shoes with Max Air cushioning for all-day comfort.",
        price: 129.99,
        images: [`${baseUrl}/public/images/products/nike_shoes.jpg`],
        category: "Footwear",
        brand: "Nike",
        rating: 4.4,
        numReviews: 428,
        stock: 100,
        isFeatured: true,
    },
    {
        name: "Levi's 511 Slim Jeans",
        description: "Classic slim fit jeans with stretch fabric for maximum comfort and style.",
        price: 59.99,
        images: [`${baseUrl}/public/images/products/levis_jeans.jpg`],
        category: "Clothing",
        brand: "Levi's",
        rating: 4.3,
        numReviews: 156,
        stock: 200,
        isFeatured: false,
    },
    {
        name: "MacBook Air M2",
        description: "Supercharged by M2 chip, remarkably thin design with up to 18 hours battery.",
        price: 1099.99,
        images: [`${baseUrl}/public/images/products/macbook.jpg`],
        category: "Electronics",
        brand: "Apple",
        rating: 4.9,
        numReviews: 534,
        stock: 25,
        isFeatured: true,
    },
    {
        name: "Instant Pot Duo 7-in-1",
        description: "Electric pressure cooker that replaces 7 kitchen appliances. 6 quart capacity.",
        price: 89.99,
        images: [`${baseUrl}/public/images/products/instant_pot.jpg`],
        category: "Home",
        brand: "Instant Pot",
        rating: 4.6,
        numReviews: 891,
        stock: 60,
        isFeatured: false,
    },
    {
        name: "Adidas Ultraboost 23",
        description: "High-performance running shoes with responsive Boost cushioning.",
        price: 179.99,
        images: [`${baseUrl}/public/images/products/adidas_shoes.jpg`],
        category: "Footwear",
        brand: "Adidas",
        rating: 4.5,
        numReviews: 267,
        stock: 85,
        isFeatured: false,
    },
    {
        name: "The Alchemist — Paulo Coelho",
        description: "A timeless classic about following your dreams and listening to your heart.",
        price: 14.99,
        images: [`${baseUrl}/public/images/products/alchemist_book.jpg`],
        category: "Books",
        brand: "HarperCollins",
        rating: 4.7,
        numReviews: 1203,
        stock: 500,
        isFeatured: false,
    },
    {
        name: "Yoga Mat Premium",
        description: "Non-slip, eco-friendly TPE yoga mat with alignment lines. 6mm thickness.",
        price: 44.99,
        images: [`${baseUrl}/public/images/products/yoga_mat.jpg`],
        category: "Sports",
        brand: "Gaiam",
        rating: 4.4,
        numReviews: 342,
        stock: 150,
        isFeatured: false,
    },
    {
        name: "Dyson V15 Detect Vacuum",
        description: "Laser reveals invisible dust. Automatically adapts suction across floor types.",
        price: 699.99,
        images: [`${baseUrl}/public/images/products/dyson_vacuum.jpg`],
        category: "Home",
        brand: "Dyson",
        rating: 4.8,
        numReviews: 178,
        stock: 20,
        isFeatured: true,
    },
    {
        name: "Men's Classic Polo Shirt",
        description: "100% cotton slim-fit polo in 8 colors. Machine washable.",
        price: 34.99,
        images: [`${baseUrl}/public/images/products/polo_shirt.jpg`],
        category: "Clothing",
        brand: "Ralph Lauren",
        rating: 4.2,
        numReviews: 89,
        stock: 300,
        isFeatured: false,
    },
    {
        name: "iPad Pro 12.9\"",
        description: "M2 chip, Liquid Retina XDR display, compatible with Apple Pencil.",
        price: 1099.00,
        images: [`${baseUrl}/public/images/products/ipad.jpg`],
        category: "Electronics",
        brand: "Apple",
        rating: 4.8,
        numReviews: 421,
        stock: 40,
        isFeatured: true,
    },
    {
        name: "Atomic Habits — James Clear",
        description: "Tiny changes, remarkable results. The most comprehensive guide to building good habits.",
        price: 16.99,
        images: [`${baseUrl}/public/images/products/atomic_habits.jpg`],
        category: "Books",
        brand: "Penguin",
        rating: 4.9,
        numReviews: 2841,
        stock: 500,
        isFeatured: false,
    },
    {
        name: "Adjustable Dumbbell Set",
        description: "5–52.5 lbs per dumbbell. Replaces 15 sets of weights. Space-saving design.",
        price: 299.99,
        images: [`${baseUrl}/public/images/products/dumbbells.jpg`],
        category: "Sports",
        brand: "Bowflex",
        rating: 4.6,
        numReviews: 567,
        stock: 35,
        isFeatured: true,
    },
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: "ecommerce" });
        console.log("✅ MongoDB Connected for seeding");

        await Product.deleteMany({});
        console.log("🗑️  Existing products cleared");

        await Product.insertMany(products);
        console.log(`🌱 ${products.length} products seeded successfully`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error.message);
        process.exit(1);
    }
};

seedProducts();
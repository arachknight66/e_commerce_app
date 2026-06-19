import mongoose from "mongoose";
import dns from "node:dns";
import { MONGODB_URI } from "./config.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI, {
            dbName: "ecommerce",
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Failed: ${error.message}`);
        process.exit(1);
    }
};
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/userModel.js";

dotenv.config();
// TODO:  should fix this
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    const users = [
      { name: "Alice", email: "alice@example.com", password: "123456" },
      { name: "Bob", email: "bob@example.com", password: "123456" },
      { name: "Charlie", email: "charlie@example.com", password: "123456" },
    ];

    await User.deleteMany();

    await User.insertMany(users);
    console.log("✅ Sample data inserted");

    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });

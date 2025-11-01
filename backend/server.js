import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors());

// --- MongoDB Models ---
const messageSchema = new mongoose.Schema({
  role: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);

// --- Routes ---

// Create a new chat
app.post("/chats", async (req, res) => {
  try {
    const { userId, title } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ error: "userId and title are required" });
    }

    const chat = new Chat({ userId, title, messages: [] });
    await chat.save();

    res.json(chat);
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).json({ error: "Server error while creating chat" });
  }
});

// Get all chats for a user
app.get("/chats", async (req, res) => {
  try {
    const { userId } = req.query;
    const chats = await Chat.find({ userId });
    res.json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Server error while fetching chats" });
  }
});

// Add a message to a chat
app.post("/chats/:chatId/messages", async (req, res) => {
  try {
    const { role, content } = req.body;
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    chat.messages.push({ role, content });
    await chat.save();

    res.json(chat);
  } catch (err) {
    console.error("Error adding message:", err);
    res.status(500).json({ error: "Server error while adding message" });
  }
});

// Delete a chat
app.delete("/chats/:chatId", async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.chatId);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting chat:", err);
    res.status(500).json({ error: "Server error while deleting chat" });
  }
});

// --- Connect to MongoDB and Start Server ---
const startServer = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/chatbotDB");
    console.log("MongoDB connected");

    const PORT = 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Database connection failed:", err);
  }
};

startServer();

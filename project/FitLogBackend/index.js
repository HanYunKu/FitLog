import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import decksRoutes from "./routes/decksRoutes.js";
import cardsRoutes from "./routes/cardsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("FlashcardsBackend API is running");
});

app.use("/api/decks", decksRoutes);
app.use("/api", cardsRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`Server listening on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

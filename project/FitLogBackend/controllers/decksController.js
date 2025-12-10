import mongoose from "mongoose";
import Day from "../models/Day.js";
import Workout from "../models/Workout.js";

export const getDecks = async (req, res) => {
    try {
        const days = await Day.find().sort({ createdAt: -1 });
        res.json(days);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const createDeck = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Title is required" });
        }

        const day = await Day.create({ title: title.trim() });
        res.status(201).json(day);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const getDeckById = async (req, res) => {
    try {
        const { deckId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deckId)) {
            return res.status(400).json({ error: "Invalid deckId" });
        }

        const day = await Day.findById(deckId);
        if (!day) {
            return res.status(404).json({ error: "Day not found" });
        }

        res.json(day);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const deleteDeck = async (req, res) => {
    try {
        const { deckId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deckId)) {
            return res.status(400).json({ error: "Invalid deckId" });
        }

        const day = await Day.findByIdAndDelete(deckId);
        if (!day) {
            return res.status(404).json({ error: "Day not found" });
        }

        await Card.deleteMany({ deckId });

        res.json({ message: "Day and its workouts deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

import mongoose from "mongoose";
import Workout from "../models/Workout.js";

// GET all workouts for a given day (deckId)
export const getCardsByDeck = async (req, res) => {
    try {
        const { deckId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deckId)) {
            return res.json([]);
        }

        const workouts = await Workout.find({ deckId }).sort({ createdAt: -1 });
        res.json(workouts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// CREATE a workout inside a day
export const createCard = async (req, res) => {
    try {
        const { deckId } = req.params;

        // New workout fields from the body
        const {
            muscleGroup,
            durationMinutes,
            details,
            imageUrl,
            // keep old fields for backwards compatibility
            question,
            answer,
        } = req.body;

        if (!mongoose.Types.ObjectId.isValid(deckId)) {
            return res.status(400).json({ error: "Invalid deckId" });
        }

        // Basic validation:
        // require at least SOME info – either workout fields or old Q/A
        if (
            !muscleGroup &&
            !details &&
            !question &&
            !answer &&
            (durationMinutes === undefined || durationMinutes === null)
        ) {
            return res
                .status(400)
                .json({ error: "Workout details are required" });
        }

        const workout = await Workout.create({
            dayId: deckId,   // new link
            deckId,          // legacy link so old code still works

            muscleGroup,
            durationMinutes,
            details,
            imageUrl,

            // keep old fields if frontend still sends them
            question,
            answer,
        });

        res.status(201).json(workout);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};


// UPDATE a workout
export const updateCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { question, answer } = req.body;

        const workout = await Workout.findByIdAndUpdate(
            cardId,
            { question, answer },
            { new: true }
        );

        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }

        res.json(workout);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// DELETE a workout
export const deleteCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const workout = await Workout.findByIdAndDelete(cardId);

        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }

        res.json({ message: "Workout deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// TOGGLE favorite (image will be added later)
export const toggleFavorite = async (req, res) => {
    try {
        const { cardId } = req.params;
        const workout = await Workout.findById(cardId);

        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }

        workout.isFavorite = !workout.isFavorite;
        await workout.save();

        res.json(workout);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// GET all favorite workouts
export const getFavoriteCards = async (req, res) => {
    try {
        const workouts = await Workout.find({ isFavorite: true }).sort({
            createdAt: -1,
        });
        res.json(workouts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

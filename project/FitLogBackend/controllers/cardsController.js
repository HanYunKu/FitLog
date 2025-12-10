import mongoose from "mongoose";
import Workout from "../models/Workout.js";

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

export const createCard = async (req, res) => {
    try {
        const { deckId } = req.params;


        const {
            muscleGroup,
            durationMinutes,
            details,
            imageUrl,

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
            dayId: deckId,
            deckId,

            muscleGroup,
            durationMinutes,
            details,
            imageUrl,


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

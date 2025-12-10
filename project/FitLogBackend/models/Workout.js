import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
    {
        dayId: {
            // 🔹 new name, but we'll keep deckId too for compatibility
            type: mongoose.Schema.Types.ObjectId,
            ref: "Day",
            //required: true,
        },

        // TEMP: keep old field for compatibility with existing frontend
        deckId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Day",
        },

        // 🧠 New workout fields
        muscleGroup: {
            type: String,
            trim: true,
        },
        durationMinutes: {
            type: Number, // how long this workout took
        },
        details: {
            type: String, // notes, sets/reps, etc.
            trim: true,
        },
        imageUrl: {
            type: String, // we'll use this for the uploaded workout photo
        },

        // OLD fields from flashcards (we'll phase these out later)
        question: String,
        answer: String,

        isFavorite: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);
export default Workout;

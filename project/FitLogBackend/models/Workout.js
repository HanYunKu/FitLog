import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
    {
        dayId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Day",

        },

        deckId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Day",
        },


        muscleGroup: {
            type: String,
            trim: true,
        },
        durationMinutes: {
            type: Number,
        },
        details: {
            type: String,
            trim: true,
        },
        imageUrl: {
            type: String,
        },

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

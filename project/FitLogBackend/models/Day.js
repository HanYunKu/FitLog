import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, },
    createdAt: { type: Date, default: Date.now },
});

const Day = mongoose.model("Day", daySchema);

export default Day;

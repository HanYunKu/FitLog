import express from "express";
import {
    updateCard,
    deleteCard,
    toggleFavorite,
    getFavoriteCards,
} from "../controllers/cardsController.js";

const router = express.Router();

router.put("/cards/:cardId", updateCard);

router.delete("/cards/:cardId", deleteCard);

router.patch("/cards/:cardId/favorite", toggleFavorite);

router.get("/cards/favorites", getFavoriteCards);

export default router;

import express from "express";
import {
    getDecks,
    createDeck,
    getDeckById,
    deleteDeck,
} from "../controllers/decksController.js";
import {
    getCardsByDeck,
    createCard,
} from "../controllers/cardsController.js";

const router = express.Router();

router.get("/", getDecks);
router.post("/", createDeck);
router.get("/:deckId", getDeckById);
router.delete("/:deckId", deleteDeck);

router.get("/:deckId/cards", getCardsByDeck);
router.post("/:deckId/cards", createCard);

export default router;

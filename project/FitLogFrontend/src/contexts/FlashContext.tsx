// @ts-nocheck
import React, { createContext, useContext, useMemo, useState } from "react";

export type Workout = { id: string; question: string; answer: string; favorite: boolean };
export type Day = { id: string; title: string; cards: Card[] };
export type FavCard = Card & { deckId: string };



type DecksCtx = {
    decks: Day[];
    addDeck: (title: string) => void;
    addCard: (deckId: string, q: string, a: string) => void;
    toggleFavorite: (deckId: string, cardId: string) => void;
    favorites: FavCard[];
};

const Ctx = createContext<DecksCtx | null>(null);
export const useDecks = () => {
    const v = useContext(Ctx);
    if (!v) throw new Error("DecksProvider missing");
    return v;
};

export function DecksProvider({ children }: { children: React.ReactNode }) {
    const [decks, setDecks] = useState<Day[]>([]);

    const addDeck = (title: string) =>
        setDecks(d => [...d, { id: Date.now().toString(), title, cards: [] }]);

    const addCard = (deckId: string, q: string, a: string) =>
        setDecks(d => d.map(deck =>
            deck.id === deckId
                ? { ...deck, cards: [...deck.cards, { id: Date.now().toString(), question: q, answer: a, favorite: false }] }
                : deck
        ));

    const toggleFavorite = (deckId: string, cardId: string) =>
        setDecks(d => d.map(deck =>
            deck.id !== deckId
                ? deck
                : { ...deck, cards: deck.cards.map(c => c.id === cardId ? { ...c, favorite: !c.favorite } : c) }
        ));


    const favorites = useMemo(
        () =>
            decks.flatMap(d =>
                d.cards
                    .filter(c => c.favorite)
                    .map(c => ({ ...c, deckId: d.id }))
            ),
        [decks]
    );


    const value = useMemo(() => ({ decks, addDeck, addCard, toggleFavorite, favorites }), [decks]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

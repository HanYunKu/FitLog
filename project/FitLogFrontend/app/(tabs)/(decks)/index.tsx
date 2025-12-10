// @ts-nocheck
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    View,
    Text,
} from "react-native";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import DeckItem from "../../../src/components/DeckItem";
import SearchBar from "../../../src/components/SearchBar";
import FAB from "../../../src/components/FAB";
import { BASE_URL } from "../../../src/config";

type Day = {
    _id: string;
    title: string;
    createdAt: string;
};

type Workout = {
    _id: string;
    question: string;
    answer: string;
    isFavorite?: boolean;
    createdAt: string;
};

export default function DecksScreen() {
    const [decks, setDecks] = useState<Day[]>([]);
    const [cardCounts, setCardCounts] = useState<Record<string, number>>({});
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);

    const loadDecks = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/decks`);
            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to load decks:", res.status, text);
                return;
            }
            const data: Day[] = await res.json();
            setDecks(data);

            if (data.length > 0) {
                const entries = await Promise.all(
                    data.map(async (deck) => {
                        try {
                            const url = `${BASE_URL}/api/decks/${deck._id}/cards`;
                            const resCards = await fetch(url);
                            if (!resCards.ok) {
                                console.error("Failed to load cards for deck:", deck._id);
                                return [deck._id, 0] as const;
                            }
                            const cards: Card[] = await resCards.json();
                            return [deck._id, cards.length] as const;
                        } catch (err) {
                            console.error("Error loading cards for deck:", deck._id, err);
                            return [deck._id, 0] as const;
                        }
                    })
                );

                setCardCounts(Object.fromEntries(entries));
            } else {
                setCardCounts({});
            }
        } catch (err) {
            console.error("Error loading decks:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            loadDecks();
        }, [loadDecks])
    );

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return decks;
        return decks.filter((d) => d.title.toLowerCase().includes(s));
    }, [q, decks]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <SearchBar value={q} onChange={setQ} />

            <FlatList
                data={filtered}
                keyExtractor={(d) => d._id}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item, index }) => (
                    <Link
                        href={`/(tabs)/(decks)/deck/${item._id}`}
                        asChild
                    >
                        <DeckItem
                            title={item.title}
                            count={cardCounts[item._id] ?? 0}
                            index={index}
                        />
                    </Link>
                )}
                ListEmptyComponent={
                    <View style={{ paddingTop: 80, alignItems: "center" }}>
                        <Text style={{ opacity: 0.6 }}>
                            Nothing yet — tap ＋ to add one.
                        </Text>
                    </View>
                }
            />


            <Link href="/(modals)/create-deck" asChild>
                <FAB onPress={() => { }} />
            </Link>
        </View>
    );
}

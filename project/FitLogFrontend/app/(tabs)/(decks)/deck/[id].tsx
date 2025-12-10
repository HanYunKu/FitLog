// @ts-nocheck
import { useState, useCallback } from "react";
import { useLocalSearchParams, Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, View, Text, ActivityIndicator } from "react-native";

import CardItem from "../../../../src/components/CardItem";
import FAB from "../../../../src/components/FAB";
import { BASE_URL } from "../../../../src/config";

type Workout = {
    _id: string;
    deckId?: string;
    dayId?: string;

    muscleGroup?: string;
    durationMinutes?: number;
    details?: string;
    imageUrl?: string;

    question?: string;
    answer?: string;

    isFavorite: boolean;
    createdAt: string;
};

export default function DeckDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const deckId = id;

    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);

    const totalWorkouts = workouts.length;
    const totalMinutes = workouts.reduce(
        (sum, w) => sum + (w.durationMinutes ?? 0),
        0
    );


    const loadCards = useCallback(async () => {
        if (!deckId) return;

        try {
            const url = `${BASE_URL}/api/decks/${deckId}/cards`;
            console.log("Fetching workouts from:", url);

            const res = await fetch(url);

            if (!res.ok) {
                const text = await res.text();
                console.error(
                    "Failed to load workouts:",
                    res.status,
                    text
                );
                return;
            }

            const data: Workout[] = await res.json();
            setWorkouts(data);
        } catch (err) {
            console.error("Error loading workouts:", err);
        } finally {
            setLoading(false);
        }
    }, [deckId]);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            loadCards();
        }, [loadCards])
    );

    const handleToggleFavorite = async (workoutId: string) => {
        try {
            const url = `${BASE_URL}/api/cards/${workoutId}/favorite`;
            console.log("Toggling favorite:", url);

            const res = await fetch(url, { method: "PATCH" });

            if (!res.ok) {
                const text = await res.text();
                console.error(
                    "Failed to toggle favorite:",
                    res.status,
                    text
                );
                return;
            }

            const updated: Workout = await res.json();

            setWorkouts((prev) =>
                prev.map((w) => (w._id === updated._id ? updated : w))
            );
        } catch (err) {
            console.error("Error toggling favorite:", err);
        }
    };

    if (!deckId) {
        return null;
    }

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    padding: 16,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            {/* Summary card */}
            <View
                style={{
                    marginBottom: 16,
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: "#f5f5f5",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <View>
                    <Text style={{ fontWeight: "700", marginBottom: 4 }}>
                        Total workouts
                    </Text>
                    <Text>{totalWorkouts}</Text>
                </View>

                <View>
                    <Text style={{ fontWeight: "700", marginBottom: 4 }}>
                        Total minutes
                    </Text>
                    <Text>{totalMinutes}</Text>
                </View>
            </View>

            {/* Workouts list */}
            <FlatList
                data={workouts}
                keyExtractor={(w) => w._id}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) => (
                    <CardItem
                        workout={item}
                        onToggleFavorite={() =>
                            handleToggleFavorite(item._id)
                        }
                    />
                )}
                ListEmptyComponent={
                    <View style={{ paddingTop: 80, alignItems: "center" }}>
                        <Text style={{ opacity: 0.6 }}>
                            No workouts yet — tap ＋ to add one.
                        </Text>
                    </View>
                }
            />

            <Link
                href={{
                    pathname: "/(modals)/create-card",
                    params: { deckId },
                }}
                asChild
            >
                <FAB onPress={() => { }} />
            </Link>
        </View>
    );

}

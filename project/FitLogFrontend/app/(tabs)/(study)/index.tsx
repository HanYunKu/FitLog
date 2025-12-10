// @ts-nocheck
import { useCallback, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import CardItem from "../../../src/components/CardItem";
import { BASE_URL } from "../../../src/config";

type Workout = {
    _id: string;
    muscleGroup?: string;
    durationMinutes?: number;
    details?: string;
    imageUrl?: string;
    question?: string;
    answer?: string;
    isFavorite: boolean;
    createdAt: string;
};

export default function StudyScreen() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);

    const loadFavorites = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/cards/favorites`);

            if (!res.ok) {
                const text = await res.text();
                console.error(
                    "Failed to load favorite workouts:",
                    res.status,
                    text
                );
                return;
            }

            const data: Workout[] = await res.json();
            setWorkouts(data);
        } catch (err) {
            console.error("Error loading favorite workouts:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            loadFavorites();
        }, [loadFavorites])
    );

    const handleToggleFavorite = async (workoutId: string) => {
        try {
            const url = `${BASE_URL}/api/cards/${workoutId}/favorite`;
            console.log("Toggling favorite from favorites tab:", url);

            const res = await fetch(url, { method: "PATCH" });

            if (!res.ok) {
                const text = await res.text();
                console.error(
                    "Failed to toggle favorite from favorites tab:",
                    res.status,
                    text
                );
                return;
            }

            const updated: Workout = await res.json();


            setWorkouts((prev) =>
                prev.filter((w) => w._id !== updated._id || updated.isFavorite)
            );

        } catch (err) {
            console.error("Error toggling favorite (favorites tab):", err);
        }
    };

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
                            You haven't favorited any workouts yet.
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

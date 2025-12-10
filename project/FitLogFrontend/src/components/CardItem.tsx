// @ts-nocheck
import { Pressable, StyleSheet, Text, View, Image } from "react-native";

type Workout = {
    _id: string;
    muscleGroup?: string;
    durationMinutes?: number;
    details?: string;
    imageUrl?: string;
    question?: string; // fallback from old flashcards
    answer?: string;   // fallback
    isFavorite: boolean;
};

type Props = {
    workout: Workout;
    onToggleFavorite: () => void;
};

export default function CardItem({ workout, onToggleFavorite }: Props) {
    // extra safety in case something is weird
    if (!workout) {
        return null;
    }

    return (
        <View style={s.card}>
            <Text style={s.label}>
                Muscle Group:{" "}
                <Text style={s.value}>
                    {workout.muscleGroup ?? workout.question ?? "—"}
                </Text>
            </Text>

            <Text style={s.label}>
                Duration:{" "}
                <Text style={s.value}>
                    {workout.durationMinutes != null
                        ? `${workout.durationMinutes} min`
                        : ""}
                </Text>
            </Text>

            <Text style={s.details}>
                {workout.details ?? workout.answer ?? ""}
            </Text>

            {workout.imageUrl ? (
                <Image
                    source={{ uri: workout.imageUrl }}
                    style={s.image}
                    resizeMode="cover"
                />
            ) : null}

            <Pressable
                onPress={onToggleFavorite}
                style={[s.fav, workout.isFavorite && s.favOn]}
            >
                <Text style={{ color: workout.isFavorite ? "white" : "#111" }}>
                    {workout.isFavorite ? "★ Favorite" : "☆ Favorite"}
                </Text>
            </Pressable>
        </View>
    );
}

const s = StyleSheet.create({
    card: {
        backgroundColor: "white",
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
        gap: 6,
    },
    label: {
        fontWeight: "700",
        marginBottom: 2,
    },
    value: {
        fontWeight: "400",
        color: "#222",
    },
    details: {
        color: "#555",
        marginBottom: 6,
    },
    fav: {
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: "#f2f2f2",
    },
    favOn: { backgroundColor: "#FFCC00" },
    image: {
        width: "100%",
        height: 180,
        borderRadius: 10,
        marginTop: 8,
    },

});

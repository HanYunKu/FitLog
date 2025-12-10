// @ts-nocheck
import { Pressable, StyleSheet, Text } from "react-native";

const COLORS = [
    "#FFEECC", // soft orange
    "#D6F5D6", // soft green
    "#DDEBFF", // soft blue
    "#FFE1F0", // soft pink
    "#FFF8CC", // soft yellow
];

type Props = {
    title: string;
    count: number;
    index?: number;
    onPress?: () => void;
};

export default function DeckItem({ title, count, index = 0, onPress }: Props) {
    const bgColor = COLORS[index % COLORS.length];

    return (
        <Pressable onPress={onPress} style={[s.card, { backgroundColor: bgColor }]}>
            <Text style={s.title}>{title}</Text>
            <Text style={s.count}>{count} workouts</Text>
        </Pressable>
    );
}

const s = StyleSheet.create({
    card: {
        padding: 20,
        borderRadius: 14,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
    },
    count: {
        marginTop: 4,
        opacity: 0.7,
    },
});

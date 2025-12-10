// @ts-nocheck
import { Pressable, StyleSheet, Text } from "react-native";

export default function FAB({ onPress }: { onPress: () => void }) {
    return (
        <Pressable onPress={onPress} style={s.fab}>
            <Text style={s.txt}>＋</Text>
        </Pressable>
    );
}

const s = StyleSheet.create({
    fab: {
        position: "absolute", right: 20, bottom: 30,
        backgroundColor: "#007AFF", borderRadius: 999,
        paddingHorizontal: 18, paddingVertical: 14, elevation: 3,
    },
    txt: { color: "white", fontSize: 20, fontWeight: "700" },
});

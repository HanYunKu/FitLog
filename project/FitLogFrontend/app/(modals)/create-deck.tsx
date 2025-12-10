// @ts-nocheck
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import { BASE_URL } from "../../src/config";

export default function CreateDeckModal() {
    const router = useRouter();
    const [title, setTitle] = useState("");

    const submit = async () => {
        const trimmed = title.trim();
        if (!trimmed) {
            Alert.alert("Error", "Please enter a deck title.");
            return;
        }

        try {
            const url = `${BASE_URL}/api/decks`;
            console.log("Creating deck at:", url);

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: trimmed }),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to create deck:", res.status, text);
                Alert.alert("Error", "Failed to create deck.");
                return;
            }

            const newDeck = await res.json();
            console.log("Added day:", newDeck);

            router.back();
        } catch (err) {
            console.error("Error adding day:", err);
            Alert.alert("Error", "Network error.");
        }
    };

    return (
        <View style={s.sheet}>
            <Text style={s.h1}>New Day</Text>

            <TextInput
                placeholder="Day_"
                value={title}
                onChangeText={setTitle}
                style={s.input}
            />

            <Pressable style={s.primary} onPress={submit}>
                <Text style={s.primaryTxt}>Save</Text>
            </Pressable>

            <Pressable onPress={() => router.back()} style={s.cancel}>
                <Text>Cancel</Text>
            </Pressable>
        </View>
    );
}

const s = StyleSheet.create({
    sheet: { flex: 1, justifyContent: "center", padding: 20, gap: 12 },
    h1: { fontSize: 22, fontWeight: "700" },
    input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12 },
    primary: { backgroundColor: "black", borderRadius: 8, padding: 14, alignItems: "center" },
    primaryTxt: { color: "white", fontWeight: "700" },
    cancel: { alignItems: "center", padding: 8 },
});

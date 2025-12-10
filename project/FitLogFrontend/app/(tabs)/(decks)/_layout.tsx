import { Stack } from "expo-router";

export default function DecksGroupLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Days" }} />
            <Stack.Screen name="deck/[id]" options={{ title: "Day" }} />
        </Stack>
    );
}

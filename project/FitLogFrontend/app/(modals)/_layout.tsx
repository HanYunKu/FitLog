import { Stack } from "expo-router";

export default function ModalsLayout() {
    return (
        <Stack screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="create-deck" options={{ title: "Add Day" }} />
            <Stack.Screen name="create-card" options={{ title: "New Workout" }} />
        </Stack>
    );
}

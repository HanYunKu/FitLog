import { Stack } from "expo-router";
import { DecksProvider } from "../src/contexts/FlashContext"

export default function RootLayout() {
    return (
        <DecksProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(modals)" options={{ presentation: "modal", headerShown: false }}
                />
            </Stack>
        </DecksProvider>
    )







}
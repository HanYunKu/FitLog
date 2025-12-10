// @ts-nocheck
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "black",
                tabBarInactiveTintColor: "#999",
            }}
        >
            {/* DAYS TAB */}
            <Tabs.Screen
                name="(decks)"
                options={{
                    tabBarLabel: "Days",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="calendar-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* FAVORITES TAB */}
            <Tabs.Screen
                name="(study)/index"
                options={{
                    tabBarLabel: "Favorite",
                    title: "Favorite",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="arm-flex-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

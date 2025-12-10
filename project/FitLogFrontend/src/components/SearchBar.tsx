// @ts-nocheck
import { View, TextInput, StyleSheet } from "react-native";

export default function SearchBar({
    value,
    onChange,
}: {
    value: string;
    onChange: (t: string) => void;
}) {
    return (
        <View style={s.wrap}>
            <TextInput
                placeholder="Search days..."
                value={value}
                onChangeText={onChange}
                style={s.input}
            />
        </View>
    );
}

const s = StyleSheet.create({
    wrap: { marginBottom: 12 },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 10,
    },
});

// @ts-nocheck

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";
import { BASE_URL } from "../../src/config";

export default function CreateCardModal() {
    const { deckId } = useLocalSearchParams<{ deckId: string }>();
    const router = useRouter();

    // 🧠 Workout fields
    const [muscleGroup, setMuscleGroup] = useState("");
    const [duration, setDuration] = useState(""); // string for input
    const [details, setDetails] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // 📷 Camera permission & state
    const [permission, requestPermission] = useCameraPermissions();
    const [showCamera, setShowCamera] = useState(false);
    const [facing, setFacing] = useState<"back" | "front">("back");
    const [isCameraReady, setIsCameraReady] = useState(false);
    const cameraRef = useRef<CameraView | null>(null);

    const toggleCameraFacing = () => {
        setFacing((current) => (current === "back" ? "front" : "back"));
    };

    const handleOpenCamera = async () => {
        if (!permission) {
            // permission object not loaded yet
            return;
        }

        if (!permission.granted) {
            const res = await requestPermission();
            if (!res.granted) {
                Alert.alert(
                    "Permission needed",
                    "We need camera permission to take a workout photo."
                );
                return;
            }
        }

        setShowCamera(true);
    };

    const handleTakePhoto = async () => {
        if (!cameraRef.current || !isCameraReady) return;

        try {
            const photo = await cameraRef.current.takePictureAsync();
            console.log("Photo URI:", photo.uri);
            setImageUrl(photo.uri);
            setShowCamera(false);
            Alert.alert("Photo taken", "We attached this photo to your workout.");
        } catch (err) {
            console.warn("Error taking photo:", err);
            Alert.alert("Error", "Could not take photo.");
        }
    };

    const submit = async () => {
        if (!deckId) {
            Alert.alert("Error", "Missing day information.");
            return;
        }

        const trimmedMuscle = muscleGroup.trim();
        const trimmedDetails = details.trim();
        const trimmedDuration = duration.trim();
        const trimmedImageUrl = imageUrl.trim();

        // basic validation: require at least something
        if (!trimmedMuscle && !trimmedDetails && !trimmedDuration && !trimmedImageUrl) {
            Alert.alert(
                "Error",
                "Please enter at least a muscle group, duration, details, or add a photo."
            );
            return;
        }

        // parse duration into a number if provided
        let durationMinutes: number | undefined = undefined;
        if (trimmedDuration) {
            const n = Number(trimmedDuration);
            if (Number.isNaN(n) || n <= 0) {
                Alert.alert(
                    "Error",
                    "Duration must be a positive number of minutes."
                );
                return;
            }
            durationMinutes = n;
        }

        try {
            const url = `${BASE_URL}/api/decks/${deckId}/cards`;
            console.log("Creating workout at:", url);

            const body = {
                muscleGroup: trimmedMuscle || undefined,
                durationMinutes,
                details: trimmedDetails || undefined,
                imageUrl: trimmedImageUrl || undefined,

                // backwards compatibility with older fields
                question: trimmedMuscle || undefined,
                answer: trimmedDetails || undefined,
            };

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to create workout:", res.status, text);
                Alert.alert("Error", "Failed to create workout.");
                return;
            }

            const newWorkout = await res.json();
            console.log("Created workout:", newWorkout);

            router.back();
        } catch (err) {
            console.error("Error creating workout:", err);
            Alert.alert("Error", "Network error.");
        }
    };

    return (
        <ScrollView contentContainerStyle={s.sheet}>
            <Text style={s.h1}>New Workout</Text>

            <TextInput
                placeholder="Muscle group (e.g., Chest, Legs)"
                value={muscleGroup}
                onChangeText={setMuscleGroup}
                style={s.input}
            />

            <TextInput
                placeholder="Duration (minutes)"
                value={duration}
                onChangeText={setDuration}
                style={s.input}
                keyboardType="numeric"
            />

            <TextInput
                placeholder="Details (sets, reps, notes...)"
                value={details}
                onChangeText={setDetails}
                style={[s.input, { height: 90, textAlignVertical: "top" }]}
                multiline
            />

            {/* preview of chosen photo */}
            {imageUrl ? (
                <View style={{ alignItems: "center", marginBottom: 12 }}>
                    <Text style={{ marginBottom: 6 }}>Attached photo:</Text>
                    <Image source={{ uri: imageUrl }} style={s.previewImage} />
                </View>
            ) : null}

            {/* Camera controls */}
            {!showCamera && (
                <Pressable style={s.secondary} onPress={handleOpenCamera}>
                    <Text style={s.secondaryTxt}>Open Camera</Text>
                </Pressable>
            )}

            {showCamera && (
                <View style={s.cameraWrapper}>
                    <CameraView
                        ref={cameraRef}
                        style={s.camera}
                        facing={facing}
                        onCameraReady={() => setIsCameraReady(true)}
                    />

                    <View style={s.buttonContainer}>
                        <TouchableOpacity
                            style={s.smallButton}
                            onPress={toggleCameraFacing}
                        >
                            <Text style={s.text}>Flip</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={s.shutterButton}
                            onPress={handleTakePhoto}
                            disabled={!isCameraReady}
                        >
                            <View style={s.shutterInner} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={s.smallButton}
                            onPress={() => setShowCamera(false)}
                        >
                            <Text style={s.text}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <Pressable style={s.primary} onPress={submit}>
                <Text style={s.primaryTxt}>Save</Text>
            </Pressable>

            <Pressable onPress={() => router.back()} style={s.cancel}>
                <Text>Cancel</Text>
            </Pressable>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    sheet: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
        gap: 12,
    },
    h1: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
    },
    primary: {
        backgroundColor: "black",
        borderRadius: 8,
        padding: 14,
        alignItems: "center",
        marginTop: 8,
    },
    primaryTxt: { color: "white", fontWeight: "700" },
    cancel: { alignItems: "center", padding: 8, marginTop: 4 },
    secondary: {
        borderWidth: 1,
        borderColor: "#444",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        marginTop: 4,
    },
    secondaryTxt: { color: "#111", fontWeight: "600" },

    cameraWrapper: {
        height: 350,
        borderRadius: 16,
        overflow: "hidden",
        marginTop: 12,
        marginBottom: 8,
    },
    camera: { flex: 1 },
    buttonContainer: {
        position: "absolute",
        bottom: 16,
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 24,
        justifyContent: "space-between",
        alignItems: "center",
    },
    smallButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    text: { fontSize: 16, fontWeight: "bold", color: "white" },
    shutterButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    shutterInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "white",
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        backgroundColor: "#eee",
    },
});

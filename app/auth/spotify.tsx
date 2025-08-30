import {View, Text, StyleSheet, Button} from "react-native";
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth";
import { useAuthStore }  from "@/store/authStore";


export default function SpotifyAuthScreen() {
    const { login, request, isLoggingIn } = useSpotifyAuth();
    const token = useAuthStore((s) => s.spotifyToken);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login with Spotify</Text>
            <Button
                title={isLoggingIn ? "Logging in..." : "Login"}
                disabled={!request || isLoggingIn}
                onPress={login}
            />
            {token && <Text style={styles.success}>✅ Logged in! Token: {token.slice(0, 10)}...</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // take full screen
        justifyContent: "center", // center vertically
        alignItems: "center", // center horizontally
        backgroundColor: "#000", // black background
        padding: 20,
    },
    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    success: {
        marginTop: 20,
        color: "limegreen",
        fontSize: 16,
    },
});
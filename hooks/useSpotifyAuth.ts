import { useState, useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import { useAuthStore } from "@/store/authStore";
import {
    SPOTIFY_CLIENT_ID,
    SPOTIFY_SCOPES,
    SPOTIFY_AUTH_ENDPOINT,
    SPOTIFY_TOKEN_ENDPOINT,
} from "@/constants/spotify";

const discovery = {
    authorizationEndpoint: SPOTIFY_AUTH_ENDPOINT,
    tokenEndpoint: SPOTIFY_TOKEN_ENDPOINT,
};

export function useSpotifyAuth() {
    const setSpotifyToken = useAuthStore((s) => s.setSpotifyToken);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const redirectUri = AuthSession.makeRedirectUri({ scheme: "beatbridge" });
    const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: SPOTIFY_CLIENT_ID,
            scopes: SPOTIFY_SCOPES,
            redirectUri,
            usePKCE: true,
        },
        discovery
    );

    useEffect(() => {
        if (response?.type === "success") {
            const { code } = response.params;
            (async () => {
                const body = new URLSearchParams({
                    client_id: SPOTIFY_CLIENT_ID,
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: redirectUri,
                    code_verifier: request?.codeVerifier || "",
                });

                const res = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: body.toString(),
                });

                const data = await res.json();
                setSpotifyToken(data.access_token);
                setIsLoggingIn(false);
            })();
        }
    }, [response, setSpotifyToken, request, redirectUri]);

    const login = async () => {
        if (isLoggingIn) return; // prevent multiple calls
        setIsLoggingIn(true);
        await promptAsync();
    };

    return { login, request, isLoggingIn };
}
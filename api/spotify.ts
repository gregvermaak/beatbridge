// api/spotify.ts
import {
    SPOTIFY_TOKEN_ENDPOINT,
    SPOTIFY_CLIENT_ID,
} from "@/constants/spotify";

/**
 * Exchange authorization code for access + refresh tokens
 */
export async function exchangeCodeForToken(
    code: string,
    codeVerifier: string,
    redirectUri: string
) {
    const body = new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        grant_type: "authorization_code",
        code,
        redirectUri,
        code_verifier: codeVerifier,
    });

    const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });

    if (!response.ok) {
        throw new Error(`Failed to exchange token: ${response.status}`);
    }

    return response.json(); // { access_token, refresh_token, expires_in, ... }
}

/**
 * Refresh an expired access token
 */
export async function refreshAccessToken(
    refreshToken: string,
    redirectUri: string
) {
    const body = new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        redirectUri,
    });

    const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });

    if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.status}`);
    }

    return response.json(); // { access_token, expires_in, ... }
}

/**
 * Fetch the current user's playlists
 */
export async function fetchUserPlaylists(accessToken: string) {
    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch playlists: ${response.status}`);
    }

    return response.json(); // { items: [...] }
}

/**
 * Fetch tracks from a specific playlist
 */
export async function fetchPlaylistTracks(
    accessToken: string,
    playlistId: string
) {
    const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch playlist tracks: ${response.status}`);
    }

    return response.json(); // { items: [...] }
}

/**
 * Add tracks to a playlist
 */
export async function addTracksToPlaylist(
    accessToken: string,
    playlistId: string,
    uris: string[]
) {
    const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uris }),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to add tracks: ${response.status}`);
    }

    return response.json();
}

/**
 * Remove tracks from a playlist
 */
export async function removeTracksFromPlaylist(
    accessToken: string,
    playlistId: string,
    uris: string[]
) {
    const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tracks: uris.map((uri) => ({ uri })) }),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to remove tracks: ${response.status}`);
    }

    return response.json();
}
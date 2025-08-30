import { create } from 'zustand'

type AuthState = {
    spotifyToken: string | null
    setSpotifyToken: (token: string) => void
};

export const useAuthStore = create<AuthState>((set) => ({
    spotifyToken: null,
    setSpotifyToken: (token) => set({ spotifyToken: token }),
}));
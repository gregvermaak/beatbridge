import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import SpotifyAuthScreen from "@/app/auth/spotify";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (<SpotifyAuthScreen />
  );
}

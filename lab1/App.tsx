import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { NetworkProvider } from './src/context/NetworkContext';
import { initDatabase } from './src/database/db';
import AppNavigator from './src/navigation/AppNavigator';
import './src/i18n';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppContent() {
    const [appReady, setAppReady] = useState(false);
    const { isLoaded, theme } = useTheme();

    useEffect(() => {
        async function prepare() {
            try {
                await Font.loadAsync(Ionicons.font);
                await initDatabase();
                setAppReady(true);
            } catch (e) {
                console.error('Failed to initialize app:', e);
                // Even if fonts fail, still show the app
                setAppReady(true);
            }
        }
        prepare();
    }, []);

    useEffect(() => {
        if (appReady && isLoaded) {
            SplashScreen.hideAsync();
        }
    }, [appReady, isLoaded]);

    if (!appReady || !isLoaded) {
        return (
            <View style={[styles.loading, { backgroundColor: '#1a1a2e' }]}>
                <ActivityIndicator size="large" color="#4cc9f0" />
            </View>
        );
    }

    return <AppNavigator />;
}

export default function App() {
    return (
        <NetworkProvider>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </NetworkProvider>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

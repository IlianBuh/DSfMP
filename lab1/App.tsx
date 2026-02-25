import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { initDatabase } from './src/database/db';
import AppNavigator from './src/navigation/AppNavigator';
import './src/i18n';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppContent() {
    const [dbReady, setDbReady] = useState(false);
    const { isLoaded, theme } = useTheme();

    useEffect(() => {
        async function prepare() {
            try {
                await initDatabase();
                setDbReady(true);
            } catch (e) {
                console.error('Failed to initialize database:', e);
            }
        }
        prepare();
    }, []);

    useEffect(() => {
        if (dbReady && isLoaded) {
            SplashScreen.hideAsync();
        }
    }, [dbReady, isLoaded]);

    if (!dbReady || !isLoaded) {
        return (
            <View style={[styles.loading, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return <AppNavigator />;
}

export default function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

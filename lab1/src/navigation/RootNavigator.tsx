import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';

// 1. Правильные импорты для JS SDK
import { onAuthStateChanged, User } from 'firebase/auth'; 

import MainTabNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../config/firebase';

export default function RootNavigator() {
    const { theme, isDark } = useTheme();
    
    const [initializing, setInitializing] = useState(true);
    // 2. Используем тип User вместо FirebaseAuthTypes.User
    const [user, setUser] = useState<User | null>(null);

    const navigationTheme = {
        ...(isDark ? DarkTheme : DefaultTheme),
        colors: {
            ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
            primary: theme.primary,
            background: theme.background,
            card: theme.surface,
            text: theme.text,
            border: theme.border,
            notification: theme.accent,
        },
    };

    // 3. Типизируем аргумент как User | null
    function handleAuthStateChanged(user: User | null) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        // 4. Используем функциональный синтаксис: метод(экземпляр_auth, колбэк)
        const unsubscribe = onAuthStateChanged(auth, handleAuthStateChanged);
        
        // Отписываемся при размонтировании
        return unsubscribe;
    }, []);

    if (initializing) {
        return (
            <View style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: theme.background 
            }}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer theme={navigationTheme}>
            {user ? <MainTabNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}
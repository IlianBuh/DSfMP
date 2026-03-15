import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import ResumeScreen from '../screens/ResumeScreen';
import TipsScreen from '../screens/TipsScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type HomeStackParamList = {
    HomeList: undefined;
    Resume: { resumeId?: number };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeList" component={HomeScreen} />
            <Stack.Screen name="Resume" component={ResumeScreen} />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    const { t } = useTranslation();
    const { theme, isDark } = useTheme();

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

    return (
        <NavigationContainer theme={navigationTheme}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: theme.surface,
                        borderTopColor: theme.border,
                        height: 60,
                        paddingBottom: 8,
                        paddingTop: 4,
                    },
                    tabBarActiveTintColor: theme.primary,
                    tabBarInactiveTintColor: theme.textSecondary,
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '600',
                    },
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeStack}
                    options={{
                        tabBarLabel: t('home.title'),
                        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                            <Ionicons name="document-text" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Tips"
                    component={TipsScreen}
                    options={{
                        tabBarLabel: t('tips.title'),
                        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                            <Ionicons name="bulb" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        tabBarLabel: t('settings.title'),
                        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                            <Ionicons name="settings" size={size} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

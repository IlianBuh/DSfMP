import { useState, useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIF_ENABLED_KEY = '@notifications_enabled';
const NOTIF_HOUR_KEY = '@notifications_hour';
const NOTIF_MINUTE_KEY = '@notifications_minute';

const DEFAULT_HOUR = 9;
const DEFAULT_MINUTE = 0;

async function getNotificationsModule() {
    try {
        return require('expo-notifications');
    } catch {
        return null;
    }
}

async function getDeviceModule() {
    try {
        return require('expo-device');
    } catch {
        return null;
    }
}

export function useNotifications() {
    const [enabled, setEnabled] = useState(false);
    const [hour, setHour] = useState(DEFAULT_HOUR);
    const [minute, setMinute] = useState(DEFAULT_MINUTE);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved settings
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedEnabled = await AsyncStorage.getItem(NOTIF_ENABLED_KEY);
            const savedHour = await AsyncStorage.getItem(NOTIF_HOUR_KEY);
            const savedMinute = await AsyncStorage.getItem(NOTIF_MINUTE_KEY);

            if (savedEnabled !== null) setEnabled(savedEnabled === 'true');
            if (savedHour !== null) setHour(parseInt(savedHour, 10));
            if (savedMinute !== null) setMinute(parseInt(savedMinute, 10));
        } catch (e) {
            console.error('Failed to load notification settings:', e);
        } finally {
            setIsLoaded(true);
        }
    };

    const requestPermission = async (): Promise<boolean> => {
        const Notifications = await getNotificationsModule();
        if (!Notifications) return false;

        const { status: existing } = await Notifications.getPermissionsAsync();
        if (existing === 'granted') return true;

        const { status } = await Notifications.requestPermissionsAsync();
        return status === 'granted';
    };

    const scheduleNotification = useCallback(async (h: number, m: number) => {
        const Notifications = await getNotificationsModule();
        if (!Notifications) return;

        // Cancel all existing scheduled notifications
        await Notifications.cancelAllScheduledNotificationsAsync();

        // Configure notification channel for Android
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('daily-reminder', {
                name: 'Daily Reminder',
                importance: 4, // MAX
                vibrationPattern: [0, 250, 250, 250],
            });
        }

        // Schedule daily notification
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Resume Builder',
                body: '📝',
                android: {
                    channelId: 'daily-reminder', 
                }
            },
            trigger: {
                type: 'daily',
                hour: h,
                minute: m,
                repeats: true,
            },
        });
    }, []);

    const cancelNotifications = useCallback(async () => {
        const Notifications = await getNotificationsModule();
        if (!Notifications) return;
        await Notifications.cancelAllScheduledNotificationsAsync();
    }, []);

    const toggleEnabled = async () => {
        const newEnabled = !enabled;

        if (newEnabled) {
            const granted = await requestPermission();
            if (!granted) {
                Alert.alert('Permission required', 'Cannot send notifications without permission.');
                return;
            }
            await scheduleNotification(hour, minute);
        } else {
            await cancelNotifications();
        }

        setEnabled(newEnabled);
        await AsyncStorage.setItem(NOTIF_ENABLED_KEY, String(newEnabled));
    };

    const updateTime = async (newHour: number, newMinute: number) => {
        setHour(newHour);
        setMinute(newMinute);
        await AsyncStorage.setItem(NOTIF_HOUR_KEY, String(newHour));
        await AsyncStorage.setItem(NOTIF_MINUTE_KEY, String(newMinute));

        if (enabled) {
            await scheduleNotification(newHour, newMinute);
        }
    };

    const incrementHour = () => {
        const newHour = (hour + 1) % 24;
        updateTime(newHour, minute);
    };

    const decrementHour = () => {
        const newHour = (hour - 1 + 24) % 24;
        updateTime(newHour, minute);
    };

    const incrementMinute = () => {
        const newMinute = (minute + 1) % 60;
        updateTime(hour, newMinute);
    };

    const decrementMinute = () => {
        const newMinute = (minute - 1 + 60) % 60;
        updateTime(hour, newMinute);
    };

    const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

    return {
        enabled,
        hour,
        minute,
        formattedTime,
        isLoaded,
        toggleEnabled,
        incrementHour,
        decrementHour,
        incrementMinute,
        decrementMinute,
    };
}

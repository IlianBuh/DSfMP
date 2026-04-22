import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export function useShakeToReset(onReset: () => void) {
    // Порог ускорения (экспериментально: 1.5 - 2.0 обычно достаточно)
    const SHAKE_THRESHOLD = 1.8;
    
    useEffect(() => {
        Accelerometer.setUpdateInterval(100);

        const subscription = Accelerometer.addListener(data => {
            const { x, y, z } = data;
            const acceleration = Math.sqrt(x * x + y * y + z * z);

            if (acceleration > SHAKE_THRESHOLD) {
                showResetAlert();
            }
        });

        return () => subscription.remove();
    }, []);

    const showResetAlert = () => {
        Alert.alert(
            "Сбросить фильтры?",
            "Вы встряхнули устройство. Хотите очистить все параметры поиска?",
            [
                { text: "Отмена", style: "cancel" },
                { text: "Сбросить", onPress: onReset, style: "destructive" }
            ]
        );
    };
}
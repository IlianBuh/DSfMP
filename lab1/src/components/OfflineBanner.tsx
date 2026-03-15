import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNetwork } from '../context/NetworkContext';
import { useTheme } from '../context/ThemeContext';

export default function OfflineBanner() {
    const { isConnected } = useNetwork();
    const { theme } = useTheme();
    const { t } = useTranslation();

    if (isConnected) return null;

    return (
        <View style={[styles.banner, { backgroundColor: theme.error }]}>
            <Ionicons name="cloud-offline-outline" size={16} color="#fff" />
            <Text style={styles.bannerText}>{t('network.offline')}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    bannerText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
    },
});

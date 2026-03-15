import React from 'react';
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useTips } from '../viewmodels/useTips';
import OfflineBanner from '../components/OfflineBanner';
import type { Tip } from '../services/api';

export default function TipsScreen() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { tips, loading, refreshing, loadingMore, hasMore, isFromCache, isConnected, onRefresh, loadMore } = useTips();

    const renderItem = ({ item }: { item: Tip }) => (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.quoteAccent, { backgroundColor: theme.primary }]} />
            <View style={styles.cardContent}>
                <Ionicons name="chatbubble-outline" size={18} color={theme.primary} style={styles.quoteIcon} />
                <Text style={[styles.quoteText, { color: theme.text }]}>
                    "{item.quote}"
                </Text>
                <Text style={[styles.authorText, { color: theme.primary }]}>
                    — {item.author}
                </Text>
            </View>
        </View>
    );

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Ionicons
                    name={isConnected ? 'bulb-outline' : 'cloud-offline-outline'}
                    size={80}
                    color={theme.border}
                />
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    {isConnected ? t('tips.empty') : t('tips.offlineEmpty')}
                </Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>
                        {t('tips.title')}
                    </Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                    {t('tips.title')}
                </Text>
                {isFromCache && (
                    <Text style={[styles.cacheLabel, { color: theme.textSecondary }]}>
                        {t('tips.cached')}
                    </Text>
                )}
            </View>
            <OfflineBanner />
            <FlatList
                data={tips}
                renderItem={renderItem}
                keyExtractor={(item: Tip) => item.id.toString()}
                contentContainerStyle={[
                    styles.list,
                    tips.length === 0 && styles.emptyList,
                ]}
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                    if (hasMore) loadMore();
                }}
                onEndReachedThreshold={0.4}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.primary}
                        colors={[theme.primary]}
                    />
                }
                ListFooterComponent={
                    loadingMore ? (
                        <View style={styles.footerLoading}>
                            <ActivityIndicator size="small" color={theme.primary} />
                        </View>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    cacheLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 16,
        paddingBottom: 100,
    },
    emptyList: {
        flex: 1,
    },
    card: {
        flexDirection: 'row',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    quoteAccent: {
        width: 4,
    },
    cardContent: {
        flex: 1,
        padding: 16,
    },
    quoteIcon: {
        marginBottom: 8,
    },
    quoteText: {
        fontSize: 15,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    authorText: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: 10,
        textAlign: 'right',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    footerLoading: {
        paddingVertical: 16,
        alignItems: 'center',
    },
});

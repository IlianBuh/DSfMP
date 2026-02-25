import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { getResumes, deleteResume, Resume } from '../database/db';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [resumes, setResumes] = useState<Resume[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadResumes();
        }, [])
    );

    const loadResumes = async () => {
        try {
            const data = await getResumes();
            setResumes(data);
        } catch (error) {
            console.error('Failed to load resumes:', error);
        }
    };

    const handleDelete = (id: number) => {
        Alert.alert(
            t('home.delete'),
            t('home.deleteConfirm'),
            [
                { text: t('home.cancel'), style: 'cancel' },
                {
                    text: t('home.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteResume(id);
                            await loadResumes();
                        } catch (error) {
                            console.error('Failed to delete resume:', error);
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (dateStr: string): string => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    };

    const renderItem = ({ item }: { item: Resume }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => navigation.navigate('Resume', { resumeId: item.id })}
            onLongPress={() => handleDelete(item.id)}
            activeOpacity={0.7}
        >
            <View style={[styles.cardAccent, { backgroundColor: theme.primary }]} />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                        <Text style={[styles.avatarText, { color: theme.textOnPrimary }]}>
                            {item.fullName ? item.fullName.charAt(0).toUpperCase() : '?'}
                        </Text>
                    </View>
                    <View style={styles.cardInfo}>
                        <Text style={[styles.cardName, { color: theme.text }]} numberOfLines={1}>
                            {item.fullName}
                        </Text>
                        <Text style={[styles.cardProfession, { color: theme.primary }]} numberOfLines={1}>
                            {item.profession}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => handleDelete(item.id)}
                        style={styles.deleteBtn}
                    >
                        <Ionicons name="trash-outline" size={20} color={theme.error} />
                    </TouchableOpacity>
                </View>
                {item.email ? (
                    <View style={styles.cardDetail}>
                        <Ionicons name="mail-outline" size={14} color={theme.textSecondary} />
                        <Text style={[styles.cardDetailText, { color: theme.textSecondary }]} numberOfLines={1}>
                            {item.email}
                        </Text>
                    </View>
                ) : null}
                {item.phone ? (
                    <View style={styles.cardDetail}>
                        <Ionicons name="call-outline" size={14} color={theme.textSecondary} />
                        <Text style={[styles.cardDetailText, { color: theme.textSecondary }]} numberOfLines={1}>
                            {item.phone}
                        </Text>
                    </View>
                ) : null}
                <Text style={[styles.cardDate, { color: theme.textSecondary }]}>
                    {t('home.created')}: {formatDate(item.createdAt)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={80} color={theme.border} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {t('home.empty')}
            </Text>
            <Text style={[styles.emptyHint, { color: theme.textSecondary }]}>
                {t('home.emptyHint')}
            </Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                    {t('home.title')}
                </Text>
                <Text style={[styles.headerCount, { color: theme.textSecondary }]}>
                    {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'}
                </Text>
            </View>
            <FlatList
                data={resumes}
                renderItem={renderItem}
                keyExtractor={(item: Resume) => item.id.toString()}
                contentContainerStyle={[
                    styles.list,
                    resumes.length === 0 && styles.emptyList,
                ]}
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('Resume', {})}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={28} color={theme.textOnPrimary} />
            </TouchableOpacity>
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
    headerCount: {
        fontSize: 14,
        marginTop: 4,
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
    cardAccent: {
        width: 4,
    },
    cardContent: {
        flex: 1,
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
    },
    cardInfo: {
        flex: 1,
    },
    cardName: {
        fontSize: 16,
        fontWeight: '600',
    },
    cardProfession: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 2,
    },
    deleteBtn: {
        padding: 8,
    },
    cardDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginLeft: 52,
    },
    cardDetailText: {
        fontSize: 13,
        marginLeft: 6,
    },
    cardDate: {
        fontSize: 12,
        marginTop: 8,
        marginLeft: 52,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    emptyHint: {
        fontSize: 14,
        marginTop: 8,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
});

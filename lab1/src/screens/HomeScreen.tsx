import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useResumes } from '../viewmodels/useResumes';
import { useResumeSearch } from '../viewmodels/useResumeSearch';
import { Resume } from '../database/db';
import OfflineBanner from '../components/OfflineBanner';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { resumes, handleDelete, formatDate } = useResumes();
    const {
        searchQuery,
        setSearchQuery,
        sortField,
        sortOrder,
        toggleSortField,
        toggleSortOrder,
        filterProfession,
        setFilterProfession,
        professions,
        filteredResumes,
    } = useResumeSearch(resumes);

    const [showProfessionFilter, setShowProfessionFilter] = useState(false);

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
                {searchQuery || filterProfession ? t('home.noResults') : t('home.empty')}
            </Text>
            {!searchQuery && !filterProfession && (
                <Text style={[styles.emptyHint, { color: theme.textSecondary }]}>
                    {t('home.emptyHint')}
                </Text>
            )}
        </View>
    );

    const sortIcon = sortOrder === 'asc' ? 'arrow-up' : 'arrow-down';
    const sortLabel = sortField === 'date' ? t('home.sortByDate') : t('home.sortByName');

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                    {t('home.title')}
                </Text>
                <Text style={[styles.headerCount, { color: theme.textSecondary }]}>
                    {t('home.count', { count: resumes.length })}
                </Text>
            </View>
            <OfflineBanner />

            {/* Search & Controls */}
            <View style={[styles.controlsContainer, { backgroundColor: theme.background }]}>
                <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Ionicons name="search-outline" size={18} color={theme.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder={t('home.search')}
                        placeholderTextColor={theme.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.controlsRow}>
                    {/* Sort toggle */}
                    <TouchableOpacity
                        style={[styles.controlBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={toggleSortField}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="swap-vertical-outline" size={16} color={theme.primary} />
                        <Text style={[styles.controlBtnText, { color: theme.text }]} numberOfLines={1}>
                            {sortLabel}
                        </Text>
                    </TouchableOpacity>

                    {/* Sort order */}
                    <TouchableOpacity
                        style={[styles.controlBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={toggleSortOrder}
                        activeOpacity={0.7}
                    >
                        <Ionicons name={sortIcon} size={16} color={theme.primary} />
                        <Text style={[styles.controlBtnText, { color: theme.text }]} numberOfLines={1}>
                            {sortOrder === 'asc' ? 'A→Z' : 'Z→A'}
                        </Text>
                    </TouchableOpacity>

                    {/* Profession filter */}
                    <TouchableOpacity
                        style={[
                            styles.controlBtn,
                            { backgroundColor: theme.surface, borderColor: theme.border },
                            filterProfession && { backgroundColor: theme.primaryLight, borderColor: theme.primary },
                        ]}
                        onPress={() => setShowProfessionFilter(!showProfessionFilter)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="funnel-outline" size={16} color={filterProfession ? theme.textOnPrimary : theme.primary} />
                        <Text
                            style={[
                                styles.controlBtnText,
                                { color: filterProfession ? theme.textOnPrimary : theme.text },
                            ]}
                            numberOfLines={1}
                        >
                            {filterProfession || t('home.filterByProfession')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Profession filter dropdown */}
            {showProfessionFilter && (
                <View style={[styles.dropdown, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <TouchableOpacity
                        style={[
                            styles.dropdownItem,
                            !filterProfession && { backgroundColor: theme.surfaceVariant },
                        ]}
                        onPress={() => {
                            setFilterProfession(null);
                            setShowProfessionFilter(false);
                        }}
                    >
                        <Text style={[styles.dropdownText, { color: theme.primary, fontWeight: '600' }]}>
                            {t('home.allProfessions')}
                        </Text>
                        {!filterProfession && (
                            <Ionicons name="checkmark" size={18} color={theme.primary} />
                        )}
                    </TouchableOpacity>
                    {professions.map((prof) => (
                        <TouchableOpacity
                            key={prof}
                            style={[
                                styles.dropdownItem,
                                filterProfession === prof && { backgroundColor: theme.surfaceVariant },
                            ]}
                            onPress={() => {
                                setFilterProfession(prof);
                                setShowProfessionFilter(false);
                            }}
                        >
                            <Text style={[styles.dropdownText, { color: theme.text }]} numberOfLines={1}>
                                {prof}
                            </Text>
                            {filterProfession === prof && (
                                <Ionicons name="checkmark" size={18} color={theme.primary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <FlatList
                data={filteredResumes}
                renderItem={renderItem}
                keyExtractor={(item: Resume) => item.id.toString()}
                contentContainerStyle={[
                    styles.list,
                    filteredResumes.length === 0 && styles.emptyList,
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
    controlsContainer: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 4,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        marginLeft: 8,
        paddingVertical: 0,
    },
    controlsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    controlBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 8,
        gap: 4,
    },
    controlBtnText: {
        fontSize: 12,
        fontWeight: '600',
    },
    dropdown: {
        marginHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    dropdownText: {
        fontSize: 14,
        flex: 1,
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

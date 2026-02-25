import React from 'react';
import {
    View,
    Text,
    Switch,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
    const { t, i18n } = useTranslation();
    const { theme, isDark, toggleTheme } = useTheme();
    const currentLang = i18n.language;

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                    {t('settings.title')}
                </Text>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Appearance Section */}
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>
                    {t('settings.appearance')}
                </Text>
                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: theme.surfaceVariant }]}>
                                <Ionicons
                                    name={isDark ? 'moon' : 'sunny'}
                                    size={20}
                                    color={theme.primary}
                                />
                            </View>
                            <Text style={[styles.settingLabel, { color: theme.text }]}>
                                {t('settings.darkTheme')}
                            </Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: theme.border, true: theme.primaryLight }}
                            thumbColor={isDark ? theme.primary : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Language Section */}
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>
                    {t('settings.language')}
                </Text>
                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <TouchableOpacity
                        style={[
                            styles.langRow,
                            currentLang === 'ru' && { backgroundColor: theme.surfaceVariant },
                        ]}
                        onPress={() => changeLanguage('ru')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingLeft}>
                            <Text style={styles.flag}>🇷🇺</Text>
                            <Text style={[styles.settingLabel, { color: theme.text }]}>
                                {t('settings.russian')}
                            </Text>
                        </View>
                        {currentLang === 'ru' && (
                            <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                        )}
                    </TouchableOpacity>
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <TouchableOpacity
                        style={[
                            styles.langRow,
                            currentLang === 'en' && { backgroundColor: theme.surfaceVariant },
                        ]}
                        onPress={() => changeLanguage('en')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingLeft}>
                            <Text style={styles.flag}>🇺🇸</Text>
                            <Text style={[styles.settingLabel, { color: theme.text }]}>
                                {t('settings.english')}
                            </Text>
                        </View>
                        {currentLang === 'en' && (
                            <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>
                    {t('settings.about')}
                </Text>
                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: theme.surfaceVariant }]}>
                                <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
                            </View>
                            <Text style={[styles.settingLabel, { color: theme.text }]}>
                                {t('settings.version')}
                            </Text>
                        </View>
                        <Text style={[styles.versionText, { color: theme.textSecondary }]}>
                            1.0.0
                        </Text>
                    </View>
                </View>
            </ScrollView>
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        marginLeft: 4,
        marginTop: 8,
    },
    card: {
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 20,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    langRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    flag: {
        fontSize: 24,
        marginRight: 12,
    },
    divider: {
        height: 1,
        marginHorizontal: 16,
    },
    versionText: {
        fontSize: 14,
    },
});

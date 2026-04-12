import React from 'react';
import {
    View,
    Text,
    Switch,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../viewmodels/useNotifications';
import { useRemoteSync } from '../viewmodels/useRemoteSync';

export default function SettingsScreen() {
    const { t, i18n } = useTranslation();
    const { theme, isDark, toggleTheme } = useTheme();
    const currentLang = i18n.language;
    const notifications = useNotifications();
    const sync = useRemoteSync();

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

                {/* Notifications Section */}
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>
                    {t('settings.notifications')}
                </Text>
                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: theme.surfaceVariant }]}>
                                <Ionicons name="notifications-outline" size={20} color={theme.primary} />
                            </View>
                            <Text style={[styles.settingLabel, { color: theme.text }]}>
                                {t('settings.notificationsEnabled')}
                            </Text>
                        </View>
                        <Switch
                            value={notifications.enabled}
                            onValueChange={notifications.toggleEnabled}
                            trackColor={{ false: theme.border, true: theme.primaryLight }}
                            thumbColor={notifications.enabled ? theme.primary : '#f4f3f4'}
                        />
                    </View>
                    {notifications.enabled && (
                        <>
                            <View style={[styles.divider, { backgroundColor: theme.border }]} />
                            <View style={styles.settingRow}>
                                <View style={styles.settingLeft}>
                                    <View style={[styles.iconCircle, { backgroundColor: theme.surfaceVariant }]}>
                                        <Ionicons name="time-outline" size={20} color={theme.primary} />
                                    </View>
                                    <Text style={[styles.settingLabel, { color: theme.text }]}>
                                        {t('settings.notificationTime')}
                                    </Text>
                                </View>
                                <View style={styles.timePicker}>
                                    <View style={styles.timeUnit}>
                                        <TouchableOpacity onPress={notifications.incrementHour} style={styles.timeBtn}>
                                            <Ionicons name="chevron-up" size={18} color={theme.primary} />
                                        </TouchableOpacity>
                                        <Text style={[styles.timeValue, { color: theme.text }]}>
                                            {String(notifications.hour).padStart(2, '0')}
                                        </Text>
                                        <TouchableOpacity onPress={notifications.decrementHour} style={styles.timeBtn}>
                                            <Ionicons name="chevron-down" size={18} color={theme.primary} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.timeSeparator, { color: theme.text }]}>:</Text>
                                    <View style={styles.timeUnit}>
                                        <TouchableOpacity onPress={notifications.incrementMinute} style={styles.timeBtn}>
                                            <Ionicons name="chevron-up" size={18} color={theme.primary} />
                                        </TouchableOpacity>
                                        <Text style={[styles.timeValue, { color: theme.text }]}>
                                            {String(notifications.minute).padStart(2, '0')}
                                        </Text>
                                        <TouchableOpacity onPress={notifications.decrementMinute} style={styles.timeBtn}>
                                            <Ionicons name="chevron-down" size={18} color={theme.primary} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </>
                    )}
                </View>

                {/* Sync Section */}
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>
                    {t('settings.sync')}
                </Text>
                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={sync.syncToRemote}
                        disabled={sync.syncing}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: theme.surfaceVariant }]}>
                                <Ionicons name="cloud-upload-outline" size={20} color={theme.primary} />
                            </View>
                            <View>
                                <Text style={[styles.settingLabel, { color: theme.text }]}>
                                    {t('settings.syncUpload')}
                                </Text>
                                {sync.lastSyncTime && (
                                    <Text style={[styles.syncTime, { color: theme.textSecondary }]}>
                                        {t('settings.lastSync')}: {sync.lastSyncTime}
                                    </Text>
                                )}
                            </View>
                        </View>
                        {sync.syncing ? (
                            <ActivityIndicator size="small" color={theme.primary} />
                        ) : (
                            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                        )}
                    </TouchableOpacity>
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={sync.syncFromRemote}
                        disabled={sync.syncing}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: theme.surfaceVariant }]}>
                                <Ionicons name="cloud-download-outline" size={20} color={theme.primary} />
                            </View>
                            <Text style={[styles.settingLabel, { color: theme.text }]}>
                                {t('settings.syncDownload')}
                            </Text>
                        </View>
                        {sync.syncing ? (
                            <ActivityIndicator size="small" color={theme.primary} />
                        ) : (
                            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                        )}
                    </TouchableOpacity>
                    {sync.error && (
                        <>
                            <View style={[styles.divider, { backgroundColor: theme.border }]} />
                            <View style={[styles.errorRow, { backgroundColor: theme.surfaceVariant }]}>
                                <Ionicons name="warning-outline" size={16} color={theme.error} />
                                <Text style={[styles.errorText, { color: theme.error }]} numberOfLines={2}>
                                    {sync.error}
                                </Text>
                            </View>
                        </>
                    )}
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
        flex: 1,
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
    timePicker: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeUnit: {
        alignItems: 'center',
    },
    timeBtn: {
        padding: 4,
    },
    timeValue: {
        fontSize: 20,
        fontWeight: '700',
        minWidth: 32,
        textAlign: 'center',
    },
    timeSeparator: {
        fontSize: 20,
        fontWeight: '700',
        marginHorizontal: 4,
    },
    syncTime: {
        fontSize: 11,
        marginTop: 2,
    },
    errorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        gap: 8,
    },
    errorText: {
        fontSize: 12,
        flex: 1,
    },
});

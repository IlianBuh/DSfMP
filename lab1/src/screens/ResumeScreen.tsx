import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useResumeForm } from '../viewmodels/useResumeForm';
import { ResumeInput } from '../database/db';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type ResumeScreenProps = NativeStackScreenProps<any, 'Resume'>;

export default function ResumeScreen({ route, navigation }: ResumeScreenProps) {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const resumeId: number | undefined = route.params?.resumeId;
    const { form, errors, isEditing, updateField, handleSave } = useResumeForm(resumeId);

    const renderInput = (
        field: keyof ResumeInput,
        icon: string,
        options: { multiline?: boolean; keyboardType?: 'default' | 'email-address' | 'phone-pad'; autoCapitalize?: 'none' | 'sentences' } = {}
    ) => (
        <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
                <Ionicons name={icon} size={16} color={theme.primary} />
                <Text style={[styles.label, { color: theme.text }]}>
                    {t(`resume.${field}`)}
                </Text>
            </View>
            <TextInput
                style={[
                    options.multiline ? styles.textArea : styles.input,
                    {
                        backgroundColor: theme.surfaceVariant,
                        color: theme.text,
                        borderColor: errors[field] ? theme.error : theme.border,
                    },
                ]}
                value={form[field]}
                onChangeText={(value: string) => updateField(field, value)}
                placeholder={t(`resume.${field}`)}
                placeholderTextColor={theme.textSecondary}
                multiline={options.multiline}
                numberOfLines={options.multiline ? 4 : 1}
                textAlignVertical={options.multiline ? 'top' : 'center'}
                keyboardType={options.keyboardType || 'default'}
                autoCapitalize={options.autoCapitalize || 'sentences'}
            />
            {errors[field] && (
                <Text style={[styles.errorText, { color: theme.error }]}>
                    {errors[field]}
                </Text>
            )}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                    {isEditing ? t('resume.edit') : t('resume.new')}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {renderInput('fullName', 'person-outline')}
                    {renderInput('profession', 'briefcase-outline')}
                    {renderInput('email', 'mail-outline', {
                        keyboardType: 'email-address',
                        autoCapitalize: 'none',
                    })}
                    {renderInput('phone', 'call-outline', {
                        keyboardType: 'phone-pad',
                    })}
                    {renderInput('experience', 'time-outline', { multiline: true })}
                    {renderInput('education', 'school-outline', { multiline: true })}
                    {renderInput('skills', 'construct-outline', { multiline: true })}
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                <TouchableOpacity
                    style={[styles.saveBtn, { backgroundColor: theme.primary }]}
                    onPress={() => handleSave(() => navigation.goBack())}
                    activeOpacity={0.8}
                >
                    <Ionicons name="checkmark" size={20} color={theme.textOnPrimary} />
                    <Text style={[styles.saveBtnText, { color: theme.textOnPrimary }]}>
                        {isEditing ? t('resume.update') : t('resume.save')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 8,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    inputGroup: {
        marginBottom: 16,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    input: {
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
    },
    textArea: {
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        minHeight: 100,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    saveBtnText: {
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },
});

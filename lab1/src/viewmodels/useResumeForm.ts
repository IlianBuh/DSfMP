import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { addResume, getResume, updateResume, ResumeInput } from '../database/db';

export function useResumeForm(resumeId?: number) {
    const { t } = useTranslation();
    const isEditing = !!resumeId;

    const [form, setForm] = useState<ResumeInput>({
        fullName: '',
        profession: '',
        email: '',
        phone: '',
        experience: '',
        education: '',
        skills: '',
    });
    const [errors, setErrors] = useState<Record<string, string | null>>({});

    useEffect(() => {
        if (isEditing && resumeId) {
            loadResume();
        }
    }, [resumeId]);

    const loadResume = async () => {
        if (!resumeId) return;
        try {
            const data = await getResume(resumeId);
            if (data) {
                setForm({
                    fullName: data.fullName || '',
                    profession: data.profession || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    experience: data.experience || '',
                    education: data.education || '',
                    skills: data.skills || '',
                });
            }
        } catch (error) {
            console.error('Failed to load resume:', error);
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!form.fullName.trim()) newErrors.fullName = t('resume.required');
        if (!form.profession.trim()) newErrors.profession = t('resume.required');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateField = (field: keyof ResumeInput, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const handleSave = async (onSuccess: () => void) => {
        if (!validate()) return;

        try {
            if (isEditing && resumeId) {
                await updateResume(resumeId, form);
                Alert.alert('✓', t('resume.updatedSuccess'));
            } else {
                await addResume(form);
                Alert.alert('✓', t('resume.savedSuccess'));
            }
            onSuccess();
        } catch (error) {
            console.error('Failed to save resume:', error);
        }
    };

    return {
        form,
        errors,
        isEditing,
        updateField,
        handleSave,
    };
}

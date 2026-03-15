import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { getResumes, deleteResume, Resume } from '../database/db';

export function useResumes() {
    const { t } = useTranslation();
    const [resumes, setResumes] = useState<Resume[]>([]);

    const loadResumes = async () => {
        try {
            const data = await getResumes();
            setResumes(data);
        } catch (error) {
            console.error('Failed to load resumes:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadResumes();
        }, [])
    );

    const handleDelete = (id: number, onDeleted?: () => void) => {
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
                            onDeleted?.();
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

    return {
        resumes,
        handleDelete,
        formatDate,
        refreshResumes: loadResumes,
    };
}

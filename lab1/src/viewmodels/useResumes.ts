import { useState, useCallback, useEffect } from 'react';
import { Alert, DeviceEventEmitter, Share } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { getResumes, deleteResume, Resume } from '../database/db';
import { subOnRemoteStore } from '../service/firestore';

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
    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('db_updated', () => {
            loadResumes();
        });

        return () => subscription.remove();
    }, []);

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

    const handleShare = async (resume: Resume) => {
        try {
            // Форматируем объект в красивую JSON строку (2 пробела для отступов)
            const resumeJson = JSON.stringify(resume, null, 2);
            
            await Share.share({
                message: resumeJson,
                title: `Резюме: ${resume.fullName}`, // Заголовок, используется на некоторых устройствах/в email
            });
        } catch (error: any) {
            console.error('Failed to share resume:', error);
            Alert.alert('Ошибка', error.message);
        }
    };

    const formatDate = (dateStr: string): string => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    };

    return {
        resumes,
        handleDelete,
        handleShare,
        formatDate,
        refreshResumes: loadResumes,
    };
}

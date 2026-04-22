import { useState, useEffect } from 'react';
import { Alert, DeviceEventEmitter } from 'react-native';
import { useTranslation } from 'react-i18next';
import { addResumeInput, getResume, updateResume, ResumeInput } from '../database/db';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile } from '../service/imageService';

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
        photoUrl: '',
    });
    const [errors, setErrors] = useState<Record<string, string | null>>({});

    useEffect(() => {
        if (isEditing && resumeId) {
            loadResume();
        }
       
        const sub = DeviceEventEmitter.addListener('db_updated', () => {
            if (isEditing && resumeId) {
                loadResume();
            }
        });

        return () => sub.remove();
    }, [resumeId, isEditing]);

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
                    photoUrl: data.photoUrl || '',
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
    
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            try {
                const asset = result.assets[0];
                const localUri = asset.uri;
                
                const fileName = `avatar_${Date.now()}.${localUri.split('.').pop()}`;

                const cloudUrl = await uploadFile(localUri, fileName);
                
                updateField('photoUrl', cloudUrl);
            } catch (e: any) {
                console.log("FULL ERROR OBJECT:", JSON.stringify(e)); // Это покажет всё
                Alert.alert("Ошибка загрузки", `Детали: ${e.message || 'Неизвестная ошибка'}`);
            }
        }
    };

    const handleSave = async (onSuccess: () => void) => {
        if (!validate()) return;

        try {
            if (isEditing && resumeId) {
                await updateResume(resumeId, form);
                Alert.alert('✓', t('resume.updatedSuccess'));
            } else {
                await addResumeInput(form);
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
        pickImage,
    };
}

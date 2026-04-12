import { supabase } from '../config/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export const uploadFile = async (uri: string, fileName: string) => {
    try {
        // Читаем файл как base64
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Загружаем в бакет 'resumes'
        const { data, error } = await supabase.storage
            .from('resumes')
            .upload(fileName, decode(base64), {
                contentType: 'image/jpeg',
                upsert: true
            });

        if (error) throw error;

        // Получаем публичную ссылку
        const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error("Supabase Upload Error:", error);
        throw error;
    }
};
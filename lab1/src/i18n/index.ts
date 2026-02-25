import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en.json';
import ru from './ru.json';

const LANGUAGE_KEY = '@app_language';

const languageDetector: any = {
    type: 'languageDetector',
    async: true,
    detect: async (callback: (lng: string) => void) => {
        try {
            const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
            if (savedLang) {
                callback(savedLang);
                return;
            }
        } catch (e) {
            // ignore
        }
        const locale = Localization.getLocales()[0]?.languageCode || 'en';
        callback(locale === 'ru' ? 'ru' : 'en');
    },
    init: () => { },
    cacheUserLanguage: async (lng: string) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_KEY, lng);
        } catch (e) {
            // ignore
        }
    },
};

i18next
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        resources: {
            en: { translation: en },
            ru: { translation: ru },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18next;

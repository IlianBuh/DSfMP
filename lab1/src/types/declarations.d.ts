declare module '@react-native-async-storage/async-storage' {
    export interface AsyncStorageStatic {
        getItem(key: string): Promise<string | null>;
        setItem(key: string, value: string): Promise<void>;
        removeItem(key: string): Promise<void>;
        clear(): Promise<void>;
    }
    const AsyncStorage: AsyncStorageStatic;
    export default AsyncStorage;
}

declare module 'react-i18next' {
    import { TFunction } from 'i18next';
    export function useTranslation(): {
        t: TFunction;
        i18n: {
            language: string;
            changeLanguage: (lng: string) => Promise<TFunction>;
        };
    };
    export const initReactI18next: any;
}

declare module 'i18next' {
    export type TFunction = (key: string, options?: Record<string, any>) => string;
    interface i18n {
        use(module: any): i18n;
        init(options: any): Promise<any>;
        language: string;
        changeLanguage(lng: string): Promise<TFunction>;
    }
    const i18next: i18n;
    export default i18next;
}

declare module 'expo-localization' {
    interface Locale {
        languageCode: string | null;
        languageTag: string;
        regionCode: string | null;
    }
    export function getLocales(): Locale[];
}

declare module 'expo-splash-screen' {
    export function preventAutoHideAsync(): Promise<boolean>;
    export function hideAsync(): Promise<boolean>;
}

declare module '@expo/vector-icons' {
    import { ComponentType } from 'react';
    interface IconProps {
        name: string;
        size?: number;
        color?: string;
        style?: any;
    }
    export const Ionicons: ComponentType<IconProps> & {
        glyphMap: Record<string, number>;
        font: any;
    };
}

declare module '@react-navigation/bottom-tabs' {
    export function createBottomTabNavigator(): any;
}

declare module '@react-navigation/native-stack' {
    export function createNativeStackNavigator<T extends Record<string, any> = any>(): any;
    export type NativeStackNavigationProp<T extends Record<string, any>, K extends keyof T = keyof T> = {
        navigate: (screen: string, params?: any) => void;
        goBack: () => void;
    };
    export type NativeStackScreenProps<T extends Record<string, any>, K extends keyof T = keyof T> = {
        navigation: NativeStackNavigationProp<T, K>;
        route: {
            key: string;
            name: string;
            params?: any;
        };
    };
}

declare module 'expo-sqlite' {
    export interface SQLiteDatabase {
        execAsync(sql: string): Promise<void>;
        getAllAsync<T = any>(sql: string, params?: any[]): Promise<T[]>;
        getFirstAsync<T = any>(sql: string, params?: any[]): Promise<T | null>;
        runAsync(sql: string, params?: any[]): Promise<{ lastInsertRowId: number; changes: number }>;
    }
    export function openDatabaseAsync(name: string): Promise<SQLiteDatabase>;
}

declare module '*.json' {
    const value: any;
    export default value;
}

declare module 'expo' {
    import { ComponentType } from 'react';
    export function registerRootComponent(component: ComponentType<any>): void;
}

declare module '@react-native-community/netinfo' {
    interface NetInfoState {
        isConnected: boolean | null;
        type: string;
    }
    interface NetInfo {
        fetch(): Promise<NetInfoState>;
        addEventListener(listener: (state: NetInfoState) => void): () => void;
    }
    const netinfo: NetInfo;
    export default netinfo;
}


declare module 'expo-device' {
    export const isDevice: boolean;
}

declare module 'expo-font' {
    export function loadAsync(fonts: Record<string, any>): Promise<void>;
}

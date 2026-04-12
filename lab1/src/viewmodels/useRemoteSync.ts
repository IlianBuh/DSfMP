import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { addResume, clearAllResumes, getResumes } from '../database/db';
import { DeviceEventEmitter } from 'react-native';

// Ключи данных, которые мы синхронизируем (например, данные резюме)
const USER_DATA_KEY = '@user_resume_data'; 
const LAST_SYNC_KEY = '@last_sync_time';

export function useRemoteSync() {
    const [syncing, setSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // В реальном приложении ID должен приходить из Firebase Auth
    const userId = "test_user_123"; 

    const updateSyncTime = async () => {
        const time = new Date().toLocaleString();
        setLastSyncTime(time);
        await AsyncStorage.setItem(LAST_SYNC_KEY, time);
    };

    const syncToRemote = async () => {
        setSyncing(true);
        setError(null);
        try {
            const allResumes = await getResumes();
            
            await setDoc(doc(db, "users", userId), {
                resumes: allResumes,
                lastSync: new Date().toISOString()
            });

            await updateSyncTime();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSyncing(false);
        }
    };

    const syncFromRemote = async () => {
        setSyncing(true);
        setError(null);
        try {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const remoteData = docSnap.data();
                const resumes = remoteData.resumes || [];
                // const remoteData = docSnap.data();
                
                await clearAllResumes();

                for (const res of resumes) {
                    // Используем твой addResume (он игнорирует старый ID и создает новый)
                    await addResume(res);
                }

                DeviceEventEmitter.emit('db_updated');
            } else {
                setError("Данные на сервере не найдены");
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSyncing(false);
        }
    };

    return {
        syncing,
        lastSyncTime,
        error,
        syncToRemote,
        syncFromRemote,
    };
}
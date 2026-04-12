import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetwork } from '../context/NetworkContext';
import { getResumes, addResume } from '../database/db';
import { uploadResumes, fetchRemoteResumes } from '../services/remoteApi';

const LAST_SYNC_KEY = '@last_sync_time';

export function useRemoteSync() {
    const { isConnected } = useNetwork();
    const [syncing, setSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Load last sync time on mount
    useState(() => {
        AsyncStorage.getItem(LAST_SYNC_KEY).then((value) => {
            if (value) setLastSyncTime(value);
        });
    });

    const syncToRemote = useCallback(async () => {
        if (!isConnected) {
            Alert.alert('Offline', 'Cannot sync without internet connection.');
            return;
        }

        setSyncing(true);
        setError(null);

        try {
            const resumes = await getResumes();
            await uploadResumes(resumes);

            const now = new Date().toLocaleString();
            setLastSyncTime(now);
            await AsyncStorage.setItem(LAST_SYNC_KEY, now);

            Alert.alert('✓', 'Resumes uploaded to server successfully.');
        } catch (e: any) {
            const msg = e?.message || 'Sync failed';
            setError(msg);
            console.error('Sync to remote failed:', e);
        } finally {
            setSyncing(false);
        }
    }, [isConnected]);

    const syncFromRemote = useCallback(async () => {
        if (!isConnected) {
            Alert.alert('Offline', 'Cannot sync without internet connection.');
            return;
        }

        setSyncing(true);
        setError(null);

        try {
            const remoteResumes = await fetchRemoteResumes();

            for (const resume of remoteResumes) {
                await addResume({
                    fullName: resume.fullName,
                    profession: resume.profession,
                    email: resume.email || '',
                    phone: resume.phone || '',
                    experience: resume.experience || '',
                    education: resume.education || '',
                    skills: resume.skills || '',
                });
            }

            const now = new Date().toLocaleString();
            setLastSyncTime(now);
            await AsyncStorage.setItem(LAST_SYNC_KEY, now);

            Alert.alert('✓', `Downloaded ${remoteResumes.length} resumes from server.`);
        } catch (e: any) {
            const msg = e?.message || 'Sync failed';
            setError(msg);
            console.error('Sync from remote failed:', e);
        } finally {
            setSyncing(false);
        }
    }, [isConnected]);

    return {
        syncing,
        lastSyncTime,
        error,
        syncToRemote,
        syncFromRemote,
    };
}

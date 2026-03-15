import { useState, useEffect, useCallback } from 'react';
import { fetchTips, Tip } from '../services/api';
import { cacheTips, getCachedTips } from '../database/db';
import { useNetwork } from '../context/NetworkContext';

export function useTips() {
    const { isConnected } = useNetwork();
    const [tips, setTips] = useState<Tip[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isFromCache, setIsFromCache] = useState(false);

    const loadTips = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            if (isConnected) {
                // Online: fetch from API and cache
                const data = await fetchTips();
                setTips(data);
                setIsFromCache(false);
                // Cache in background
                try {
                    await cacheTips(data);
                } catch (cacheErr) {
                    console.warn('Failed to cache tips:', cacheErr);
                }
            } else {
                // Offline: load from cache
                const cached = await getCachedTips();
                setTips(cached);
                setIsFromCache(cached.length > 0);
            }
        } catch (error) {
            console.error('Failed to load tips:', error);
            // Fallback to cache on any error
            try {
                const cached = await getCachedTips();
                setTips(cached);
                setIsFromCache(cached.length > 0);
            } catch (cacheErr) {
                console.error('Failed to load cached tips:', cacheErr);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [isConnected]);

    useEffect(() => {
        loadTips();
    }, [loadTips]);

    const onRefresh = useCallback(() => {
        loadTips(true);
    }, [loadTips]);

    return {
        tips,
        loading,
        refreshing,
        isFromCache,
        isConnected,
        onRefresh,
    };
}

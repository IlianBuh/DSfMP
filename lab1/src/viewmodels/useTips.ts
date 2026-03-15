import { useState, useEffect, useCallback } from 'react';
import { fetchTipsPage, Tip } from '../services/api';
import { replaceTipsCache, upsertTipsCache, getCachedTips } from '../database/db';
import { useNetwork } from '../context/NetworkContext';

const PAGE_LIMIT = 30;

function mergeUniqueTips(existing: Tip[], incoming: Tip[]): Tip[] {
    const map = new Map<number, Tip>();
    for (const tip of existing) map.set(tip.id, tip);
    for (const tip of incoming) map.set(tip.id, tip);
    return Array.from(map.values());
}

export function useTips() {
    const { isConnected } = useNetwork();
    const [tips, setTips] = useState<Tip[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isFromCache, setIsFromCache] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [nextSkip, setNextSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const loadInitial = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setLoadingMore(false);

        try {
            if (isConnected) {
                // Online: fetch first page from API and replace cache
                const page = await fetchTipsPage({ limit: PAGE_LIMIT, skip: 0 });
                setTips(page.tips);
                setIsFromCache(false);
                setNextSkip(page.skip + page.limit);
                setHasMore(page.skip + page.limit < page.total);

                try {
                    await replaceTipsCache(page.tips);
                } catch (cacheErr) {
                    console.warn('Failed to replace tips cache:', cacheErr);
                }
            } else {
                // Offline: load from cache
                const cached = await getCachedTips();
                setTips(cached as unknown as Tip[]);
                setIsFromCache(cached.length > 0);
                setNextSkip(cached.length);
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load tips:', error);
            // Fallback to cache on any error
            try {
                const cached = await getCachedTips();
                setTips(cached as unknown as Tip[]);
                setIsFromCache(cached.length > 0);
                setNextSkip(cached.length);
                setHasMore(false);
            } catch (cacheErr) {
                console.error('Failed to load cached tips:', cacheErr);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [isConnected]);

    useEffect(() => {
        loadInitial();
    }, [loadInitial]);

    const loadMore = useCallback(async () => {
        if (!isConnected) return;
        if (loading || refreshing || loadingMore) return;
        if (!hasMore) return;

        setLoadingMore(true);
        try {
            const page = await fetchTipsPage({ limit: PAGE_LIMIT, skip: nextSkip });
            setTips((prev) => mergeUniqueTips(prev, page.tips));
            setIsFromCache(false);
            const newNextSkip = page.skip + page.limit;
            setNextSkip(newNextSkip);
            setHasMore(newNextSkip < page.total);

            try {
                await upsertTipsCache(page.tips);
            } catch (cacheErr) {
                console.warn('Failed to upsert tips cache:', cacheErr);
            }
        } catch (error) {
            console.error('Failed to load more tips:', error);
        } finally {
            setLoadingMore(false);
        }
    }, [hasMore, isConnected, loading, loadingMore, nextSkip, refreshing]);

    const onRefresh = useCallback(() => {
        loadInitial(true);
    }, [loadInitial]);

    return {
        tips,
        loading,
        refreshing,
        loadingMore,
        hasMore,
        isFromCache,
        isConnected,
        onRefresh,
        loadMore,
    };
}

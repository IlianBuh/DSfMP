import { useState, useMemo } from 'react';
import { Resume } from '../database/db';

export type SortField = 'date' | 'name';
export type SortOrder = 'asc' | 'desc';

/** Levenshtein distance between two strings */
function levenshtein(a: string, b: string): number {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost,
            );
        }
    }
    return dp[m][n];
}

/** Check if any word in text fuzzy-matches the query (Levenshtein ≤ maxDist) */
function fuzzyMatch(text: string, query: string, maxDist = 2): boolean {
    const words = text.toLowerCase().split(/\s+/);
    const q = query.toLowerCase();
    return words.some((word) => levenshtein(word, q) <= maxDist);
}

/** Check if text contains the query as a substring (case-insensitive) */
function substringMatch(text: string, query: string): boolean {
    return text.toLowerCase().includes(query.toLowerCase());
}

/** Search across multiple resume fields */
function matchesSearch(resume: Resume, query: string): boolean {
    if (!query.trim()) return true;

    const searchFields = [
        resume.fullName,
        resume.profession,
        resume.email,
        resume.skills,
    ];

    const terms = query.trim().toLowerCase().split(/\s+/);

    return terms.every((term) => {
        // First try exact substring match (higher priority)
        const hasSubstring = searchFields.some((field) => substringMatch(field, term));
        if (hasSubstring) return true;

        // Fallback to fuzzy match
        return searchFields.some((field) => fuzzyMatch(field, term));
    });
}

/** Get unique professions from the resume list */
export function getUniqueProfessions(resumes: Resume[]): string[] {
    const set = new Set<string>();
    for (const r of resumes) {
        if (r.profession.trim()) {
            set.add(r.profession.trim());
        }
    }
    return Array.from(set).sort();
}

export function useResumeSearch(resumes: Resume[]) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [filterProfession, setFilterProfession] = useState<string | null>(null);

    const professions = useMemo(() => getUniqueProfessions(resumes), [resumes]);

    const filteredResumes = useMemo(() => {
        let result = [...resumes];

        // 1. Filter by profession
        if (filterProfession) {
            result = result.filter((r) => r.profession.trim() === filterProfession);
        }

        // 2. Search (substring + fuzzy)
        if (searchQuery.trim()) {
            result = result.filter((r) => matchesSearch(r, searchQuery));
        }

        // 3. Sort
        result.sort((a, b) => {
            let cmp = 0;
            if (sortField === 'date') {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                cmp = dateA - dateB;
            } else {
                cmp = a.fullName.localeCompare(b.fullName);
            }
            return sortOrder === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [resumes, searchQuery, sortField, sortOrder, filterProfession]);

    const toggleSortField = () => {
        setSortField((prev) => (prev === 'date' ? 'name' : 'date'));
    };

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    const clearFilters = () => {
        setSearchQuery('');
        setFilterProfession(null);
        setSortField('date');
        setSortOrder('desc');
    };

    return {
        searchQuery,
        setSearchQuery,
        sortField,
        sortOrder,
        toggleSortField,
        toggleSortOrder,
        filterProfession,
        setFilterProfession,
        professions,
        filteredResumes,
        clearFilters,
    };
}

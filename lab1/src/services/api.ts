export interface Tip {
    id: number;
    quote: string;
    author: string;
}

interface ApiResponse {
    quotes: Tip[];
    total: number;
    skip: number;
    limit: number;
}

const API_BASE_URL = 'https://dummyjson.com/quotes';

export interface TipsPage {
    tips: Tip[];
    total: number;
    skip: number;
    limit: number;
}

export const fetchTipsPage = async (params: { limit: number; skip: number }): Promise<TipsPage> => {
    const url = `${API_BASE_URL}?limit=${encodeURIComponent(params.limit)}&skip=${encodeURIComponent(params.skip)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    const data: ApiResponse = await response.json();
    return {
        tips: data.quotes,
        total: data.total,
        skip: data.skip,
        limit: data.limit,
    };
};

export const fetchTips = async (): Promise<Tip[]> => {
    const page = await fetchTipsPage({ limit: 30, skip: 0 });
    return page.tips;
};

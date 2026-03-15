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

const API_URL = 'https://dummyjson.com/quotes?limit=30';

export const fetchTips = async (): Promise<Tip[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    const data: ApiResponse = await response.json();
    return data.quotes;
};

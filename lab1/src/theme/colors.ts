export interface ThemeColors {
    primary: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceVariant: string;
    text: string;
    textSecondary: string;
    textOnPrimary: string;
    border: string;
    error: string;
    success: string;
    card: string;
    statusBar: 'light' | 'dark';
}

export const lightTheme: ThemeColors = {
    primary: '#4361ee',
    primaryLight: '#7b8fff',
    secondary: '#3f37c9',
    accent: '#f72585',
    background: '#f8f9fa',
    surface: '#ffffff',
    surfaceVariant: '#f0f2f5',
    text: '#1a1a2e',
    textSecondary: '#6c757d',
    textOnPrimary: '#ffffff',
    border: '#dee2e6',
    error: '#e63946',
    success: '#2a9d8f',
    card: '#ffffff',
    statusBar: 'dark',
};

export const darkTheme: ThemeColors = {
    primary: '#4cc9f0',
    primaryLight: '#7ae8ff',
    secondary: '#4361ee',
    accent: '#f72585',
    background: '#0f0f23',
    surface: '#1a1a2e',
    surfaceVariant: '#252540',
    text: '#e8e8e8',
    textSecondary: '#a8a8b8',
    textOnPrimary: '#0f0f23',
    border: '#2a2a3e',
    error: '#ff6b6b',
    success: '#51cf66',
    card: '#1a1a2e',
    statusBar: 'light',
};

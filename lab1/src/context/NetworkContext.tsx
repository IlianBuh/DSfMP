import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface NetworkContextType {
    isConnected: boolean;
}

const NetworkContext = createContext<NetworkContextType>({ isConnected: true });

interface NetworkProviderProps {
    children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        let unsubscribe: (() => void) | null = null;

        const setup = async () => {
            try {
                const NetInfo = require('@react-native-community/netinfo');
                // Get initial state
                const state = await NetInfo.default.fetch();
                setIsConnected(state.isConnected !== false);
                // Subscribe to changes
                unsubscribe = NetInfo.default.addEventListener((state: any) => {
                    setIsConnected(state.isConnected !== false);
                });
            } catch (e) {
                console.warn('NetInfo not available:', e);
                setIsConnected(true);
            }
        };

        setup();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return (
        <NetworkContext.Provider value={{ isConnected }}>
            {children}
        </NetworkContext.Provider>
    );
};

export const useNetwork = (): NetworkContextType => {
    return useContext(NetworkContext);
};

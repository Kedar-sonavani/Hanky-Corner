'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getApiUrl } from '@/lib/api';

// Define context shape
interface MasterSwitchContextType {
    isEcommerceActive: boolean;
    whatsappNumber: string;
    isLoading: boolean;
    refreshConfig: () => Promise<void>;
    updateSettings: (settings: { is_ecommerce_active?: boolean, whatsapp_number?: string }) => Promise<void>;
}

const MasterSwitchContext = createContext<MasterSwitchContextType | undefined>(undefined);

export const MasterSwitchProvider = ({ children }: { children: React.ReactNode }) => {
    const { session } = useAuth();
    const [isEcommerceActive, setIsEcommerceActive] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState('917822832788');
    const [isLoading, setIsLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            const apiUrl = getApiUrl();
            const res = await fetch(`${apiUrl}/api/settings/config`);

            if (!res.ok) throw new Error('Failed to fetch config');

            const data = await res.json();
            setIsEcommerceActive(data.is_ecommerce_active);
            if (data.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
        } catch (error) {
            console.error('Master Switch Sync Failed:', error);
            setIsEcommerceActive(false);
        } finally {
            setIsLoading(false);
        }
    };

    const updateSettings = async (settings: { is_ecommerce_active?: boolean, whatsapp_number?: string }) => {
        try {
            const apiUrl = getApiUrl();
            const res = await fetch(`${apiUrl}/api/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify(settings)
            });

            if (!res.ok) throw new Error('Failed to update settings');
            await fetchConfig();
        } catch (error) {
            console.error('Update Settings Failed:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return (
        <MasterSwitchContext.Provider value={{
            isEcommerceActive,
            whatsappNumber,
            isLoading,
            refreshConfig: fetchConfig,
            updateSettings
        }}>
            {children}
        </MasterSwitchContext.Provider>
    );
};

export const useMasterSwitch = () => {
    const context = useContext(MasterSwitchContext);
    if (context === undefined) {
        throw new Error('useMasterSwitch must be used within a MasterSwitchProvider');
    }
    return context;
};

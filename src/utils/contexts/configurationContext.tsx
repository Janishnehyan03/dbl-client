// src/context/ConfigurationContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

import toast from "react-hot-toast";
import { LibraryDetails } from "../types";
import Axios from "../Axios";

interface ConfigurationContextType {
    configuration: LibraryDetails | null;
    fetchConfig: () => Promise<void>;
}

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export const ConfigurationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [configuration, setConfiguration] = useState<LibraryDetails | null>(null);

    const fetchConfig = async () => {
        try {
            const { data } = await Axios.get('/configurations');
            setConfiguration(data);
        } catch (error) {
            console.error("Error loading configuration:", error);
            toast.error("Error loading configuration.");
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return (
        <ConfigurationContext.Provider value={{ configuration, fetchConfig }}>
            {children}
        </ConfigurationContext.Provider>
    );
};

// Custom hook for using the ConfigurationContext
export const useConfiguration = () => {
    const context = useContext(ConfigurationContext);
    if (context === undefined) {
        throw new Error("useConfiguration must be used within a ConfigurationProvider");
    }
    return context;
};
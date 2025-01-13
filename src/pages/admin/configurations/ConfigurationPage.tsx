import React, { useEffect, useState } from "react";
import ConfigurationForm from "../components/ConfigurationForm";
import { LibraryDetails } from '../../../utils/types';
import Axios from "../../../utils/Axios";
import toast from "react-hot-toast";

const ConfigurationPage: React.FC = () => {
    const [configuration, setConfiguration] = useState<LibraryDetails | null>(null);

    const fetchConfig = async () => {
        try {
            const { data } = await Axios.get('/configurations');
            setConfiguration(data); // Ensure data is a single configuration object
        } catch (error) {
            console.error("Error loading configuration:", error);
            toast.error("Error loading configuration.");
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleSave = async (data: LibraryDetails) => {
        try {
            await Axios.patch(`/configurations`, data);
            toast.success("Configuration Updated");
            fetchConfig(); // Refresh the configuration after save
        } catch (error) {
            console.error("Error saving configuration:", error);
            toast.error("Error saving configuration.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Library Configuration</h2>
            {configuration ? (
                <ConfigurationForm onSubmit={handleSave} initialData={configuration} />
            ) : (
                <p>Loading configuration...</p>
            )}
        </div>
    );
};

export default ConfigurationPage;

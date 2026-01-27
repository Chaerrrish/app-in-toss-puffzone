import { useState, useCallback } from 'react';

// Simple mock state for the form
export function useReportForm() {
    const [formData, setFormData] = useState({
        latitude: 37.5536,
        longitude: 126.9725,
        address: 'Seoul (Mock)',
    });

    const setLocation = useCallback((data: { latitude: number; longitude: number; address: string }) => {
        setFormData(prev => ({ ...prev, ...data }));
        console.log('Location set:', data);
    }, []);

    return { formData, setLocation };
}

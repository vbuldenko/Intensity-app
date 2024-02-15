import { useState } from 'react';

export const useField = (type) => {
    const [value, setValue] = useState('');

    const onChange = (event) => {
        setValue(event.target.value);
    };

    const reset = (event) => {
        setValue('');
    };

    const props = { type, value, onChange };

    return [props, reset];
};

export const useLocalStorage = (keyName, defaultValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = window.localStorage.getItem(keyName);
            return value ? JSON.parse(value) : defaultValue;
        } catch (err) {
            console.error(
                `Error reading from localStorage for key ${keyName}:`,
                err
            );
            return defaultValue;
        }
    });

    const setValue = (newValue) => {
        try {
            window.localStorage.setItem(keyName, JSON.stringify(newValue));
            setStoredValue(newValue);
        } catch (err) {
            console.error(
                `Error writing to localStorage for key ${keyName}:`,
                err
            );
        }
    };

    return [storedValue, setValue];
};

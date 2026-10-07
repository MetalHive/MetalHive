import { useEffect, useState } from 'react';

/**
 * Returns `value` after it has stopped changing for `delay` ms.
 * Used to avoid firing a request on every keystroke in search inputs.
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

export default useDebouncedValue;

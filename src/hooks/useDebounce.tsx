import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number | null): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		if (delay === 0 || delay == null) {
			if (value !== debouncedValue) {
				setDebouncedValue(value);
			}
			return;
		}
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay, debouncedValue]);

	return debouncedValue;
}

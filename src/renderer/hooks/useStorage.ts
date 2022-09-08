import { useCallback, useEffect, useMemo, useState } from "react";

type ThingsThatAreNotFunctions = string | boolean | number | object | null;

type StorageType = "session" | "local";

type UseStorageItem<T> = [T, (value: T) => void];

function StorageItemHookGenerator(storageType: StorageType) {
  // based on useHooks' useSessionStorage:
  // https://usehooks-ts.com/react-hook/use-session-storage
  if (!window || !window[`${storageType}Storage`]) {
    console.warn(`Failed to find '${storageType}Storage' in environment`);
  }

  return function useStorageItem<T extends ThingsThatAreNotFunctions>(
    key: string,
    initialValue: T | (() => T) | undefined,
  ): UseStorageItem<T> {
    const resolvedInitialValue: T | undefined = useMemo(
      () => resolveValue(initialValue),
      [],
    );

    const readValue = valueReader(key, storageType, resolvedInitialValue);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    const setValue = useCallback(
      (value: T) => {
        try {
          const resolvedValue = resolveValue(value);
          window[`${storageType}Storage`].setItem(
            key,
            JSON.stringify(resolvedValue),
          );
          setStoredValue(resolvedValue);
        } catch (error) {
          console.warn(`Error setting sessionStorage key “${key}”:`, error);
        }
      },
      [key],
    );

    // hydrate once
    useEffect(() => {
      setValue(readValue());
    }, []);

    return [storedValue, setValue];
  };
}

export const useSessionStorageItem = StorageItemHookGenerator("session");
export const useLocalStorageItem = StorageItemHookGenerator("local");

function parseJSON<T>(value: string | null): T | undefined {
  try {
    return value === "undefined" ? undefined : JSON.parse(value ?? "");
  } catch {
    console.log("parsing error on", { value });
    return undefined;
  }
}

function resolveValue<T>(value: T | (() => T)): T {
  return value instanceof Function ? value() : value;
}

function valueReader<T>(
  key: string,
  storageType: StorageType,
  fallbackValue: T | undefined,
) {
  return function readValue(): T {
    try {
      const item = window[`${storageType}Storage`].getItem(key);

      return (item ? (parseJSON(item) as T) : fallbackValue) as T;
    } catch (error) {
      console.warn(
        `Error reading '${storageType}Storage' key “${key}”:`,
        error,
      );
      return fallbackValue as T;
    }
  };
}

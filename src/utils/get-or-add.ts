export function getOrAdd<T>(
    object: Record<string, T>,
    key: string,
    createValue: () => T
): T {
    if (object[key] == null) {
        object[key] = createValue();
    }

    return object[key];
}
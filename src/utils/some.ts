export function some<T>(
    collection: Iterable<T>,
    condition: (n: T) => boolean
): boolean {
    for (const item of collection) {
        if (condition(item)) {
            return true;
        }
    }
    return false;
}
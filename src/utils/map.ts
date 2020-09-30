declare global {
    // noinspection JSUnusedGlobalSymbols
    interface ObjectConstructor {
        entries<TKey extends string, TValue>(object: Record<TKey, TValue>): Array<[TKey, TValue]>;
    }
}

export function map<TKey extends string, TValue, TResult>(
    object: Record<TKey, TValue>,
    transform: (value: TValue, key: TKey) => TResult
): Array<TResult> {
    return Object.entries<TKey, TValue>(object)
        .map(([key, value]) => transform(value, key));
}
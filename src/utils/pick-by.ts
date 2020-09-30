type AnyObject = Record<string, unknown>;

export function pickBy<TOriginal extends AnyObject>(
    object: TOriginal,
    predicate: (key: keyof TOriginal, value?: unknown) => boolean
): TOriginal {
    const result = {} as AnyObject;

    Object.entries(object)
        .filter(([key, value]) => predicate(key, value))
        .forEach(([key, value]) => { result[key] = value; });

    return result as TOriginal;
}

export function pick<
    TObject extends AnyObject,
    TKey extends keyof TObject
>(
    object: TObject,
    keys: Set<TKey>
): Pick<TObject, TKey> {
    return pickBy(
        object,
        (key) => (keys as Set<keyof TObject>).has(key)
    );
}

export function omit<
    TObject extends AnyObject,
    TKey extends keyof TObject
>(
    object: TObject,
    keys: Set<TKey>
): Pick<TObject, TKey> {
    return pickBy(
        object,
        (key) => !(keys as Set<keyof TObject>).has(key)
    );
}
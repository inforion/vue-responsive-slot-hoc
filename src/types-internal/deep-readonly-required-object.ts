/* eslint-disable no-use-before-define,@typescript-eslint/no-explicit-any */
type DeepReadonlyRequired<T> =
    T extends (infer R)[] ? ReadonlyArray<DeepReadonlyRequired<R>> :
        T extends Function ? T :
            T extends Record<string, any> ? DeepReadonlyRequiredObject<T> :
                T;

export type DeepReadonlyRequiredObject<T> = {
    readonly [P in keyof T]-?: DeepReadonlyRequired<T[P]>;
};
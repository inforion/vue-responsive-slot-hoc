/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecordPropsDefinition } from 'vue/types/options';

type PropsArray = Array<string>;
type PropsRecord = RecordPropsDefinition<Record<string, any>>;

type Prop = PropsArray | PropsRecord;

declare global {
    interface ObjectConstructor {
        fromEntries<T = any>(entries: Iterable<readonly [PropertyKey, T]>): { [k: string]: T };
    }
}

export default function getProps(
    originalProps: Prop | undefined,
    groupPropName: string
): PropsRecord {
    if (originalProps != null && groupPropName in originalProps) {
        throw new Error(`Original component should not contain prop: ${groupPropName}`);
    }

    const newProps: PropsRecord = {
        [groupPropName]: {
            type: String,
            required: false
        }
    };

    if (originalProps == null) {
        return newProps;
    }

    const transformedOriginalProps = Array.isArray(originalProps)
        ? Object.fromEntries(originalProps.map((name) => [name, {}]))
        : originalProps;

    return {
        ...transformedOriginalProps,
        ...newProps
    };
}
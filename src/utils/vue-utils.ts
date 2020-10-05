import Vue, { VueConstructor } from 'vue';
import { ComponentOptions } from 'vue/types/options';

declare module 'vue' {
    // eslint-disable-next-line no-shadow
    interface VueConstructor<V extends Vue = Vue> {
        options: ComponentOptions<V>;
    }
}

export function isVueConstructor(
    component: VueConstructor | ComponentOptions<Vue>
): component is VueConstructor {
    return typeof component === 'function';
}

export function getOptions(
    component: VueConstructor | ComponentOptions<Vue>
): ComponentOptions<Vue> {
    return isVueConstructor(component)
        ? component.options
        : component;
}
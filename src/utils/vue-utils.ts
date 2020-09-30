import Vue, { VueConstructor } from 'vue';
import { ComponentOptions } from 'vue/types/options';

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
import type Vue from 'vue';
import { ComponentOptions } from 'vue/types/options';

declare module 'vue' {
    interface VueConstructor<V extends Vue = Vue> {
        options: ComponentOptions<V>;
    }
}
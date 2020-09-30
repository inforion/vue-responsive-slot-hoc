import { Vue } from 'vue/types/vue';

export interface WrapperComponent extends Vue {
    readonly hasOverflow: boolean;

    groupHasOverflow: boolean;
}
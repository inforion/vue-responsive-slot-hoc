import mergeOptions from 'merge-options';
import Vue, {
    CreateElement,
    VNode,
    VueConstructor
} from 'vue';
import { ComponentOptions } from 'vue/types/options';
import { ScopedSlot, ScopedSlotReturnValue } from 'vue/types/vnode';
import type { Vue as VueInterface } from 'vue/types/vue';

import {
    defaultOptions,
    ResponsiveSlotOptions
} from '../options';
import {
    DeepReadonlyRequiredObject,
    VueResizeEvent,
    WrapperComponent
} from '../types-internal';
import {
    getOptions,
    map,
    omit,
    pick,
    withListener
} from '../utils';
import getProps from './get-props';
import SharedSizeGroupManager from './shared-size-group-manager';
import updateHasOverflowName from './update-has-overflow-name';

interface Data {
    parentWidth: number | null;
    childrenWidth: number | null;
}

interface Computed {
    shouldHideSlot: boolean;
}

interface Methods {
    getGroupName(): string | undefined;
    getTargetSlotContent(h: CreateElement): ScopedSlotReturnValue;
    getSlots(h: CreateElement, targetSlotContent: ScopedSlotReturnValue): Array<ScopedSlotReturnValue>
    getScopedSlots(h: CreateElement, targetSlotContent: ScopedSlotReturnValue): Record<string, ScopedSlot | undefined>;
    updateParentWidth(event: VueResizeEvent): void;
    updateChildrenWidth(): void;
}

interface ResponsiveSlotComponent extends VueInterface, WrapperComponent, Data, Computed, Methods {}

function getReference(slotName: string): string {
    return `slot-ref-${slotName}`;
}

export default function withResponsiveSlot(
    component: VueConstructor | ComponentOptions<Vue>,
    options?: ResponsiveSlotOptions
): ComponentOptions<Vue> {
    const finalOptions = mergeOptions(
        defaultOptions,
        options
    ) as DeepReadonlyRequiredObject<ResponsiveSlotOptions>;

    const {
        alwaysDisplayed,
        hideOnOverflow
    } = finalOptions.slotNames.generated;

    const groupPropName = finalOptions.propNames.groupName;

    const targetSlotName = finalOptions.slotNames.target;

    const generatedSlotNames = new Set([alwaysDisplayed, hideOnOverflow]);
    const allActualSlotNames = new Set([...generatedSlotNames, targetSlotName]);

    const wrapperComponent: ComponentOptions<ResponsiveSlotComponent> = {
        props: getProps(
            getOptions(component).props,
            groupPropName
        ),

        data() {
            return {
                parentWidth: null as number | null,
                childrenWidth: null as number | null,
                groupHasOverflow: false
            };
        },

        computed: {
            hasOverflow(this: ResponsiveSlotComponent): boolean {
                if (this.childrenWidth == null || this.parentWidth == null) {
                    return false;
                }

                return this.childrenWidth > this.parentWidth;
            },

            shouldHideSlot(this: ResponsiveSlotComponent): boolean {
                return this.getGroupName() != null
                    ? this.groupHasOverflow
                    : this.hasOverflow;
            }
        },

        watch: {
            hasOverflow(this: ResponsiveSlotComponent): void {
                this.$emit(updateHasOverflowName, this.getGroupName());
            },

            [groupPropName](
                this: ResponsiveSlotComponent,
                newValue: string | undefined,
                oldValue: string | undefined
            ): void {
                SharedSizeGroupManager.unregisterComponent(this, oldValue);
                SharedSizeGroupManager.registerComponent(this, newValue);
            }
        },

        methods: {
            getGroupName(): string | undefined {
                /* @ts-ignore */
                return this[groupPropName] as string | undefined;
            },

            getTargetSlotContent(
                h: CreateElement
            ): ScopedSlotReturnValue {
                const generatedSlots = pick(this.$scopedSlots, generatedSlotNames);

                return map(
                    generatedSlots,
                    (renderVNode, name) => h(
                        'div',
                        {
                            ref: getReference(name),
                            style: this.shouldHideSlot && name === hideOnOverflow ? 'display: none;' : undefined,
                            on: {
                                resize: this.updateChildrenWidth.bind(this)
                            },
                            directives: [{
                                name: 'resize'
                            }]
                        },
                        renderVNode == null
                            ? undefined
                            : [renderVNode({})]
                    )
                );
            },

            getSlots(
                h: CreateElement,
                targetSlotContent: ScopedSlotReturnValue
            ): Array<ScopedSlotReturnValue> {
                const targetSlotNode = h(
                    'template',
                    {
                        slot: targetSlotName
                    },
                    [targetSlotContent]
                );

                const otherSlots = omit(this.$scopedSlots, allActualSlotNames);

                const otherSlotNodes = map(
                    otherSlots,
                    (renderVNode) => renderVNode?.({})
                );

                return [targetSlotNode, ...otherSlotNodes];
            },

            getScopedSlots(
                h: CreateElement,
                targetSlotContent: ScopedSlotReturnValue
            ): Record<string, ScopedSlot | undefined> {
                const targetSlot = (): ReturnType<ScopedSlot> => [targetSlotContent];

                const otherSlots = omit(this.$scopedSlots, allActualSlotNames);

                return {
                    [targetSlotName]: targetSlot,
                    ...otherSlots
                };
            },

            updateParentWidth(event: VueResizeEvent): void {
                this.parentWidth = event.detail.width;
            },

            updateChildrenWidth(): void {
                const alwaysDisplayedElement = this.$refs[getReference(alwaysDisplayed)] as HTMLElement;
                const hideableElement = this.$refs[getReference(hideOnOverflow)] as HTMLElement;

                this.childrenWidth = alwaysDisplayedElement.clientWidth + hideableElement.clientWidth;
            }
        },

        mounted(this: ResponsiveSlotComponent) {
            SharedSizeGroupManager.registerComponent(this, this.getGroupName());
        },

        beforeDestroy(this: ResponsiveSlotComponent) {
            SharedSizeGroupManager.unregisterComponent(this, this.getGroupName());
        },

        render(
            this: ResponsiveSlotComponent,
            h: CreateElement
        ): VNode {
            return h(
                component,
                {
                    attrs: this.$attrs,
                    props: this.$props,
                    on: withListener(
                        this.$listeners,
                        'resize',
                        this.updateParentWidth.bind(this)
                    ),
                    directives: [{
                        name: 'resize'
                    }],
                    scopedSlots: this.getScopedSlots(h, this.getTargetSlotContent(h))
                },
                this.getSlots(h, this.getTargetSlotContent(h))
            );
        }
    };

    return wrapperComponent as ComponentOptions<Vue>;
}
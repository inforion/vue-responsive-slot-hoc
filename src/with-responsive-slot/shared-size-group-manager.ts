import { WrapperComponent } from '../types-internal';
import { getOrAdd, some } from '../utils';
import updateEventName from './update-has-overflow-name';

type ComponentsGroup = Set<WrapperComponent>;
type ComponentsStorage = Record<string, ComponentsGroup>;

/**
 * Keeps all components with the same group id in sync
 */
export default class SharedSizeGroupManager {
    private static componentsStorage = Object.create(null) as ComponentsStorage;

    public static registerComponent(
        component: WrapperComponent,
        groupId: string | undefined
    ): void {
        if (groupId == null) {
            return;
        }

        component.$on(updateEventName, SharedSizeGroupManager.updateAll);

        getOrAdd(
            SharedSizeGroupManager.componentsStorage,
            groupId,
            () => new Set()
        ).add(component);

        SharedSizeGroupManager.updateAll(groupId);
    }

    public static unregisterComponent(
        component: WrapperComponent,
        groupId: string | undefined
    ): void {
        if (groupId == null) {
            return;
        }

        component.$off(updateEventName, SharedSizeGroupManager.updateAll);

        const group = SharedSizeGroupManager.componentsStorage[groupId];

        if (group != null) {
            group.delete(component);
            if (group.size === 0) {
                delete SharedSizeGroupManager.componentsStorage[groupId];
            }
            SharedSizeGroupManager.updateAll(groupId);
        }
    }

    public static updateAll = (groupId: string | undefined): void => {
        if (groupId == null) {
            return;
        }

        const group = SharedSizeGroupManager.componentsStorage[groupId];

        if (group == null) {
            return;
        }

        const groupHasOverflow = some(
            group,
            (component) => (component.hasOverflow)
        );

        group.forEach(
            (component) => {
                component.groupHasOverflow = groupHasOverflow;
            }
        );
    };
}
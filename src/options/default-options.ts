import { DeepReadonlyRequiredObject } from '../types-internal';
import { ResponsiveSlotOptions } from './options';

export const defaultOptions: DeepReadonlyRequiredObject<ResponsiveSlotOptions> = {
    slotNames: {
        target: 'default',

        generated: {
            alwaysDisplayed: 'icon',
            hideOnOverflow: 'text'
        }
    },

    propNames: {
        groupName: 'group'
    }
};
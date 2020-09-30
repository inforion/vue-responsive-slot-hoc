export interface ResponsiveSlotOptions {
    slotNames?: {
        target?: string;

        generated?: {
            alwaysDisplayed?: string;

            hideOnOverflow?: string;
        }
    },

    propNames?: {
        groupName?: string;
    }
}
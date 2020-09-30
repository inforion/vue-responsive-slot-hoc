# vue-responsive-slot-hoc

[![NPM version](https://img.shields.io/npm/v/vue-responsive-slot-hoc.svg)](https://www.npmjs.com/package/vue-responsive-slot-hoc)

## Description

### Basic

This package provides a higher-order component (HOC) function that returns a new [Vue.js](https://vuejs.org/) component, same as the provided one,
but with two additional slots.

Content of both these slots will be passed into one chosen existing slot of the provided component:
* Content of the first additional slot will always be displayed inside original component's target slot;
* Content of the second additional slot will be shown near the first one, only of there is enough space for it.

### Example

Taken an external Button component with single slot for all its content,
this HOC function can create the same button but with two slots for content:
* An icon can be passed into one slot, and it will always be displayed;
* A text can be passed into another slot, and it will be shown only when there is enough space for this text inside the button.

### Groups

The resulting component always has the `group` prop (its name can be changed in options). If there are several
instantiated components with the same `group` prop value, and at least one of them doesn't have enough space to
display the second additional slot content, then it will be hidden for every component in that group.

# Installation

Install using NPM:

```
npm install vue-responsive-slot-hoc
```

or using Yarn:

```
yarn add vue-responsive-slot-hoc
```

# Usage

```ts
import withResponsiveSlot from 'vue-responsive-slot-hoc';

const ResultComponent = withResponsiveSlot(YourComponent)
```

or with options:

```ts
import withResponsiveSlot from 'vue-responsive-slot-hoc';

const ResultComponent = withResponsiveSlot(YourComponent, options)
```

### Options

These are all available options and their default values:

```ts
{
    slotNames: {
        // Name of slot where the conent of two additional slots will be passed into
        target: 'default', 

        generated: {
            // Name of the generated slot whose content will be passed into the target slot
            // and will always be displayed
            alwaysDisplayed: 'icon',

            // Name of the generated slot whose content will also be passed into the target slot
            // and will be displayed only if there is enough space for it
            hideOnOverflow: 'text'
        }
    },

    propNames: {
        // Name of prop used to group multiple components.
        // If at least one of grouped components doesn't have enough space to display 'hideOnOverflow' slot content,
        // this slot content will be hidden for all components in group
        groupName: 'group'
    }
}
```
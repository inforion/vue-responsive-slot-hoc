type Listener = Function;
type ListenersGroup = Array<Listener>;
type ListenerOrGroup = Listener | ListenersGroup;
type Listeners = Record<string, ListenerOrGroup>;

function toGroup(
    listenerOrGroup: ListenerOrGroup | undefined
): ListenersGroup {
    if (listenerOrGroup == null) {
        return [];
    }

    if (Array.isArray(listenerOrGroup)) {
        return listenerOrGroup;
    }

    return [listenerOrGroup];
}

export function withListener(
    listeners: Listeners,
    name: string,
    listener: Function
): Listeners {
    return {
        ...listeners,
        [name]: [...toGroup(listeners[name]), listener]
    };
}
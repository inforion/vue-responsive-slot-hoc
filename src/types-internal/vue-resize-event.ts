interface ElementSize {
    height: number;

    width: number;
}

export interface VueResizeEvent extends Event {
    detail: ElementSize;
}
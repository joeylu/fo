export interface Point {
    x: number;
    y: number;
}
export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface Size {
    width: number;
    height: number;
}
export declare type Placement = 'top' | 'right' | 'bottom' | 'left';
export interface Geometry {
    origin: Point;
    anchor: Point;
    placement: Placement;
}
export declare const computeGeometry: (contentSize: Size, placement: "auto" | "bottom" | "left" | "right" | "top", fromRect: Rect, displayArea: Rect, arrowSize: Size) => Geometry;

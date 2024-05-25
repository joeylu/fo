import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';
import { Geometry, Placement, Rect, Size } from './PopoverGeometry';
export declare type Orientation = 'portrait' | 'portrait-upside-down' | 'landscape' | 'landscape-left' | 'landscape-right';
export interface PopoverProps {
    visible?: boolean;
    onClose?: () => void;
    onDismiss?: () => void;
    arrowSize?: Size;
    placement?: Placement | 'auto';
    fromRect: Rect;
    displayArea?: Rect;
    backgroundStyle?: StyleProp<ViewStyle>;
    arrowStyle?: StyleProp<ViewStyle>;
    popoverStyle?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    duration?: number;
    easing?: (show: boolean) => (value: number) => number;
    useNativeDriver?: boolean;
    supportedOrientations?: Orientation[];
}
export interface PopoverState extends Geometry {
    contentSize: Size;
    visible: boolean;
    isAwaitingShow: boolean;
    animation: Animated.Value;
}
export declare class Popover extends React.PureComponent<PopoverProps, PopoverState> {
    static propTypes: {
        visible: PropTypes.Requireable<boolean>;
        onClose: PropTypes.Requireable<(...args: any[]) => any>;
        onDismiss: PropTypes.Requireable<(...args: any[]) => any>;
        arrowSize: PropTypes.Requireable<PropTypes.InferProps<{
            x: PropTypes.Requireable<number>;
            y: PropTypes.Requireable<number>;
        }>>;
        placement: PropTypes.Requireable<string>;
        fromRect: PropTypes.Requireable<PropTypes.InferProps<{
            x: PropTypes.Requireable<number>;
            y: PropTypes.Requireable<number>;
            width: PropTypes.Requireable<number>;
            height: PropTypes.Requireable<number>;
        }>>;
        displayArea: PropTypes.Requireable<PropTypes.InferProps<{
            x: PropTypes.Requireable<number>;
            y: PropTypes.Requireable<number>;
            width: PropTypes.Requireable<number>;
            height: PropTypes.Requireable<number>;
        }>>;
        backgroundStyle: PropTypes.Requireable<any>;
        arrowStyle: PropTypes.Requireable<any>;
        popoverStyle: PropTypes.Requireable<any>;
        contentStyle: PropTypes.Requireable<any>;
        duration: PropTypes.Requireable<number>;
        easing: PropTypes.Requireable<(...args: any[]) => any>;
    };
    static defaultProps: Partial<PopoverProps>;
    static displayName: string;
    private defaultDisplayArea;
    constructor(props: PopoverProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    private computeGeometry;
    private onOrientationChange;
    private updateState;
    private measureContent;
    private getTranslateOrigin;
    componentWillReceiveProps(nextProps: PopoverProps): void;
    private startAnimation;
    private onHidden;
    private computeStyles;
    render(): JSX.Element;
}

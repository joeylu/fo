import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Rect } from './PopoverGeometry';
export interface Props {
    onPopoverDisplayed?: () => any;
}
export interface State {
    showPopover: boolean;
    popoverAnchor: Rect;
}
export declare class PopoverTouchable extends React.PureComponent<Props, State> {
    static propTypes: {
        onPopoverDisplayed: PropTypes.Requireable<(...args: any[]) => any>;
    };
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    private onOrientationChange;
    private touchable;
    private setRef;
    private onPress;
    private onTouchableMeasured;
    private onClosePopover;
    render(): JSX.Element;
}

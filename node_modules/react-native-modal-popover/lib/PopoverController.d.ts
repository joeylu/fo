import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Rect } from './PopoverGeometry';
export interface PopoverControllerRenderProps {
    openPopover: () => void;
    closePopover: () => void;
    popoverVisible: boolean;
    setPopoverAnchor: (ref: any) => void;
    popoverAnchorRect: Rect;
}
export interface Props {
    children: (props: PopoverControllerRenderProps) => React.ReactElement<any>;
}
export interface State {
    showPopover: boolean;
    popoverAnchor: Rect;
}
export declare class PopoverController extends React.PureComponent<Props, State> {
    static propTypes: {
        children: PropTypes.Validator<(...args: any[]) => any>;
    };
    state: State;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private onOrientationChange;
    private touchable;
    private setTouchableRef;
    private openPopover;
    private onTouchableMeasured;
    private closePopover;
    render(): React.ReactElement<any>;
}

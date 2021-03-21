"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PropTypes = require("prop-types");
var React = require("react");
var react_native_1 = require("react-native");
var PopoverTouchable = (function (_super) {
    __extends(PopoverTouchable, _super);
    function PopoverTouchable(props) {
        var _this = _super.call(this, props) || this;
        _this.onOrientationChange = function () {
            if (_this.state.showPopover) {
                requestAnimationFrame(_this.onPress);
            }
        };
        _this.touchable = null;
        _this.setRef = function (ref) {
            _this.touchable = ref;
        };
        _this.onPress = function () {
            var handle = react_native_1.findNodeHandle(_this.touchable);
            if (handle) {
                react_native_1.NativeModules.UIManager.measure(handle, _this.onTouchableMeasured);
            }
        };
        _this.onTouchableMeasured = function (x0, y0, width, height, x, y) {
            _this.setState({
                showPopover: true,
                popoverAnchor: { x: x, y: y, width: width, height: height },
            }, function () {
                if (_this.props.onPopoverDisplayed) {
                    _this.props.onPopoverDisplayed();
                }
            });
        };
        _this.onClosePopover = function () { return _this.setState({ showPopover: false }); };
        _this.state = {
            showPopover: false,
            popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
        };
        return _this;
    }
    PopoverTouchable.prototype.componentDidMount = function () {
        react_native_1.Dimensions.addEventListener('change', this.onOrientationChange);
    };
    PopoverTouchable.prototype.componentWillUnmount = function () {
        react_native_1.Dimensions.removeEventListener('change', this.onOrientationChange);
    };
    PopoverTouchable.prototype.render = function () {
        var children = React.Children.toArray(this.props.children);
        if (children.length !== 2 ||
            children[1] instanceof Number ||
            children[1] instanceof String ||
            children[1].type.displayName !== 'Popover') {
            throw new Error('Popover touchable must have two children and the second one must be Popover');
        }
        return (<React.Fragment>
        {React.cloneElement(children[0], {
            ref: this.setRef,
            onPress: this.onPress,
        })}
        {React.cloneElement(children[1], {
            visible: this.state.showPopover,
            onClose: this.onClosePopover,
            fromRect: this.state.popoverAnchor,
        })}
      </React.Fragment>);
    };
    PopoverTouchable.propTypes = {
        onPopoverDisplayed: PropTypes.func,
    };
    return PopoverTouchable;
}(React.PureComponent));
exports.PopoverTouchable = PopoverTouchable;
//# sourceMappingURL=PopoverTouchable.js.map
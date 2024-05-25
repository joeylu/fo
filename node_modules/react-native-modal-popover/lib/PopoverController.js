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
var PopoverController = (function (_super) {
    __extends(PopoverController, _super);
    function PopoverController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            showPopover: false,
            popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
        };
        _this.onOrientationChange = function () {
            if (_this.state.showPopover) {
                requestAnimationFrame(_this.openPopover);
            }
        };
        _this.touchable = null;
        _this.setTouchableRef = function (ref) {
            _this.touchable = ref;
        };
        _this.openPopover = function () {
            var handle = react_native_1.findNodeHandle(_this.touchable);
            if (handle) {
                react_native_1.NativeModules.UIManager.measure(handle, _this.onTouchableMeasured);
            }
        };
        _this.onTouchableMeasured = function (x0, y0, width, height, x, y) {
            _this.setState({
                showPopover: true,
                popoverAnchor: { x: x, y: y, width: width, height: height },
            });
        };
        _this.closePopover = function () { return _this.setState({ showPopover: false }); };
        return _this;
    }
    PopoverController.prototype.componentDidMount = function () {
        react_native_1.Dimensions.addEventListener('change', this.onOrientationChange);
    };
    PopoverController.prototype.componentWillUnmount = function () {
        react_native_1.Dimensions.removeEventListener('change', this.onOrientationChange);
    };
    PopoverController.prototype.render = function () {
        return this.props.children({
            openPopover: this.openPopover,
            closePopover: this.closePopover,
            setPopoverAnchor: this.setTouchableRef,
            popoverVisible: this.state.showPopover,
            popoverAnchorRect: this.state.popoverAnchor,
        });
    };
    PopoverController.propTypes = {
        children: PropTypes.func.isRequired,
    };
    return PopoverController;
}(React.PureComponent));
exports.PopoverController = PopoverController;
//# sourceMappingURL=PopoverController.js.map
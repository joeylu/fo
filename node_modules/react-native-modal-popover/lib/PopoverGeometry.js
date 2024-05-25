"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeGeometry = function (contentSize, placement, fromRect, displayArea, arrowSize) {
    var effectiveArrowSize = getArrowSize(arrowSize, placement);
    switch (placement) {
        case 'top':
            return computeTopGeometry(displayArea, fromRect, contentSize, effectiveArrowSize);
        case 'bottom':
            return computeBottomGeometry(displayArea, fromRect, contentSize, effectiveArrowSize);
        case 'left':
            return computeLeftGeometry(displayArea, fromRect, contentSize, effectiveArrowSize);
        case 'right':
            return computeRightGeometry(displayArea, fromRect, contentSize, effectiveArrowSize);
        default:
            return computeAutoGeometry(displayArea, fromRect, contentSize, effectiveArrowSize);
    }
};
var getArrowSize = function (size, placement) {
    if (placement === 'left' || placement === 'right') {
        return { width: size.height, height: size.width };
    }
    return size;
};
var computeTopGeometry = function (displayArea, fromRect, contentSize, arrowSize) {
    var origin = {
        x: Math.min(displayArea.x + displayArea.width - contentSize.width, Math.max(displayArea.x, fromRect.x + (fromRect.width - contentSize.width) / 2)),
        y: fromRect.y - contentSize.height - arrowSize.height,
    };
    var anchor = { x: fromRect.x + fromRect.width / 2, y: fromRect.y };
    return { origin: origin, anchor: anchor, placement: 'top' };
};
var computeBottomGeometry = function (displayArea, fromRect, contentSize, arrowSize) {
    var origin = {
        x: Math.min(displayArea.x + displayArea.width - contentSize.width, Math.max(displayArea.x, fromRect.x + (fromRect.width - contentSize.width) / 2)),
        y: fromRect.y + fromRect.height + arrowSize.height,
    };
    var anchor = { x: fromRect.x + fromRect.width / 2, y: fromRect.y + fromRect.height };
    return { origin: origin, anchor: anchor, placement: 'bottom' };
};
var computeLeftGeometry = function (displayArea, fromRect, contentSize, arrowSize) {
    var origin = {
        x: fromRect.x - contentSize.width - arrowSize.width,
        y: Math.min(displayArea.y + displayArea.height - contentSize.height, Math.max(displayArea.y, fromRect.y + (fromRect.height - contentSize.height) / 2)),
    };
    var anchor = { x: fromRect.x, y: fromRect.y + fromRect.height / 2 };
    return { origin: origin, anchor: anchor, placement: 'left' };
};
var computeRightGeometry = function (displayArea, fromRect, contentSize, arrowSize) {
    var origin = {
        x: fromRect.x + fromRect.width + arrowSize.width,
        y: Math.min(displayArea.y + displayArea.height - contentSize.height, Math.max(displayArea.y, fromRect.y + (fromRect.height - contentSize.height) / 2)),
    };
    var anchor = { x: fromRect.x + fromRect.width, y: fromRect.y + fromRect.height / 2 };
    return { origin: origin, anchor: anchor, placement: 'right' };
};
var computeAutoGeometry = function (displayArea, fromRect, contentSize, arrowSize) {
    var geom = null;
    var placements = ['left', 'top', 'right', 'bottom'];
    for (var i = 0; i < 4; i += 1) {
        var placement = placements[i];
        geom = exports.computeGeometry(contentSize, placement, fromRect, displayArea, arrowSize);
        var origin = geom.origin;
        if (origin.x >= displayArea.x &&
            origin.x <= displayArea.x + displayArea.width - contentSize.width &&
            origin.y >= displayArea.y &&
            origin.y <= displayArea.y + displayArea.height - contentSize.height) {
            break;
        }
    }
    return geom;
};
//# sourceMappingURL=PopoverGeometry.js.map
var SimpleResize = (function () {
    'use strict';

    function SimpleResize(handler, containerToResize) {
        var self = this;

        this.handler = handler;
        this.initialParams = {
            x: 0,
            y: 0,
            maxWidth: 0
        };

        this.eventBounds = {
            mouseMove: self.onDrag.bind(self),
            mouseUp: self.stopDrag.bind(self),
            mouseDown: self.initDrag.bind(self)
        };

        this.container = containerToResize;

        this.bindEvents();
    }

    SimpleResize.prototype.initDrag = function (e) {
        var bounds = this.eventBounds;

        //this.startPosition.x = e.clientX;
        this.initialParams.maxWidth = document.body.clientWidth;

        document.addEventListener('mousemove', bounds.mouseMove, false);
        document.addEventListener('mouseup', bounds.mouseUp, false);
    };

    SimpleResize.prototype.onDrag = function (event) {
        var handlerStyle = this.handler.style,
            position,
            initialParams = this.initialParams,
            diffX;

        event.preventDefault();

        position = event.clientX / initialParams.maxWidth;

        if (position < 0.5) {
            position = 0.5;
        }

        if (position > 1) {
            position = 1;
        }

        handlerStyle.left = position * 100 + '%';

        // Take into account, that container is centered
        this.container.style.width = (2 * position - 1) * 100 + '%';
    };

    SimpleResize.prototype.stopDrag = function (event) {
        var bounds = this.eventBounds;

        event.preventDefault();

        document.removeEventListener('mousemove', bounds.mouseMove, false);
        document.removeEventListener('mouseup', bounds.mouseUp, false);
    };



    SimpleResize.prototype.bindEvents = function () {
        var bounds = this.eventBounds;
        this.handler.addEventListener('mousedown', bounds.mouseDown, false);
    };

    return SimpleResize;
}());
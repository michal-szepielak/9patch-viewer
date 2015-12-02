var SimpleResize = (function () {
    'use strict';

    function SimpleResize(handler, containerToResize) {
        var self = this;

        this.handler = handler;

        this.eventBounds = {
            mouseMove: self.onDrag.bind(self),
            mouseUp: self.stopDrag.bind(self),
            mouseDown: self.initDrag.bind(self)
        };

        this.bindEvents();
    }

    SimpleResize.prototype.initDrag = function (e) {
        var bounds = this.eventBounds;

        document.addEventListener('mousemove', bounds.mouseMove, false);
        document.addEventListener('mouseup', bounds.mouseUp, false);
    };

    SimpleResize.prototype.onDrag = function (event) {
        var handlerStyle = this.handler.style;

        event.preventDefault();
        console.log('mousemove', event);
        //this.handler.style.left = (event.pageX - window.innerWidth) + "px";
        if (event.pageX <= window.innerWidth/2) {
            return;
        }
        handlerStyle.left = ((parseInt(handlerStyle.left, 10) || 0) + event.movementX) + "px";
    };

    SimpleResize.prototype.stopDrag = function (event) {
        var bounds = this.eventBounds;

        event.preventDefault();

        document.removeEventListener('mousemove', bounds.mouseMove, false);
        document.removeEventListener('mouseup', bounds.mouseUp, false);
    };



    SimpleResize.prototype.bindEvents = function () {
        var handler = this.handler,
            self = this;

        handler.addEventListener('mousedown', function (event) {
            event.preventDefault();

            self.initDrag();

            console.log('mousedown');
        }, false);


    };

    return SimpleResize;
}());
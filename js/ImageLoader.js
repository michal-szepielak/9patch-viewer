var ImageLoader = (function () {
    'use strict';

    var ImageLoader = function (element, onImageLoad, onError) {
        if (!element) {
            console.warn('Couldn\'t bind ImageLoader to element!');
            return false;
        }

        this.eventBounds = null;
        this.hiddenInput = null;
        this.fileReader = new FileReader();
        this.onImageLoad = onImageLoad || function () { return false; };
        this.onError = onError || function () { return false; };
        this.element = element;
        this.build();
        this.bindEvents();

        return this;
    };

    function elementClick(self, event) {
        event.stopPropagation();
        self.hiddenInput.click();
    }

    function fileChange(self, event) {
        event.stopPropagation();

        if (self.fileReader.readyState === FileReader.LOADING) {
            self.fileReader.abort();
        }

        if (event.target && event.target.files && event.target.files[0]) {
            self.fileReader.readAsDataURL(event.target.files[0]);
        }
    }

    function fileReadInterruption(self, event) {
        self.onError(event);
    }

    function fileReadLoadStart(self, event) {
        self.setProgress(0);
        console.log('fileReadLoadStart', event);
    }

    function fileReadLoadEnd(self, event) {
        console.log('fileReadLoadEnd', event);
    }

    function fileReadLoad(self, event) {
        var image = new Image();

        image.src = event.target.result;
        self.onImageLoad(image);
        self.setProgress(100);
    }

    function fileReadProgress(self, event) {
        self.setProgress(Math.round(event.loaded / event.total * 100));
    }

    ImageLoader.prototype.setProgress = function (progress) {
        this.element.className = 'btn progress-' + (Math.floor(progress / 10) * 10);
    };

    ImageLoader.prototype.build = function () {
        var input = document.createElement('input'),
            parent = this.element.parentElement;

        input.type = 'file';
        this.hiddenInput = input;
    };

    ImageLoader.prototype.bindEvents = function () {
        var bounds = {
            elementClick: elementClick.bind(null, this),
            fileChange: fileChange.bind(null, this),
            fileReadAbort: fileReadInterruption.bind(null, this),
            fileReadError: fileReadInterruption.bind(null, this),
            fileReadLoadStart: fileReadLoadStart.bind(null, this),
            fileReadLoadEnd: fileReadLoadEnd.bind(null, this),
            fileReadLoad: fileReadLoad.bind(null, this),
            fileReadProgress: fileReadProgress.bind(null, this)
        };

        this.element.addEventListener('click', bounds.elementClick, true);
        this.hiddenInput.addEventListener('change', bounds.fileChange, true);

        this.fileReader.addEventListener('abort', bounds.fileReadAbort, false);
        this.fileReader.addEventListener('error', bounds.fileReadError, false);
        this.fileReader.addEventListener('loadstart', bounds.fileReadLoadStart, false);
        this.fileReader.addEventListener('loadend', bounds.fileReadLoadEnd, false);
        this.fileReader.addEventListener('load', bounds.fileReadLoad, false);
        this.fileReader.addEventListener('progress', bounds.fileReadProgress, false);

        this.eventBounds = bounds;
    };

    ImageLoader.prototype.unbindEvents = function () {
        this.element.removeEventListener('click', this.eventBounds.elementClick, true);
        this.hiddenInput.removeEventListener('change', this.eventBounds.fileChange, true);

        this.fileReader.removeEventListener('abort', bounds.fileReadAbort, false);
        this.fileReader.removeEventListener('error', bounds.fileReadError, false);
        this.fileReader.removeEventListener('loadstart', bounds.fileReadLoadStart, false);
        this.fileReader.removeEventListener('loadend', bounds.fileReadLoadEnd, false);
        this.fileReader.removeEventListener('load', bounds.fileReadLoad, false);
        this.fileReader.removeEventListener('progress', bounds.fileReadProgress, false);

        this.eventBounds = null;
    };

    ImageLoader.prototype.destroy = function () {
        this.unbindEvents();
        this.hiddenInput = null;
        this.element = null;
    };

    return ImageLoader;
}());
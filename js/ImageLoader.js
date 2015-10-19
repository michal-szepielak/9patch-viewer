/*jslint browser:true, plusplus:true*/
/*global FileReader*/
var ImageLoader = (function () {
    'use strict';

    var dragCollection = [],
        loaderStates = {
            'SUCCESS': 'green',
            'ERROR': 'red',
            'IDLE': ''
        },
        fileDialogOpened = false,
        fileDropZoneOpened = false,
        ImageLoader = function (uiObjects, onImageLoad, onError) {

            if (!uiObjects.element) {
                console.warn('Couldn\'t bind ImageLoader to element!');
                return;
            }

            if (!uiObjects.dropZoneContainer) {
                console.warn('Couldn\'t bind ImageLoader to dropZoneContainer!');
                return;
            }

            if (!uiObjects.documentMain) {
                console.warn('Couldn\'t bind ImageLoader to documentMain!');
                return;
            }

            this.eventBounds = null;
            this.hiddenInput = null;
            this.fileReader = new FileReader();
            this.onImageLoad = onImageLoad || function () { return false; };
            this.onError = onError || function () { return false; };
            this.ui = uiObjects;
            this.ui.clonedMain = null;

            return this;
        };

    function elementClick(self, event) {
        event.stopPropagation();
        self.showDropZone(true);
        setTimeout(function () {
            self.hiddenInput.click();
            fileDialogOpened = true;
        }, 400);
    }

    function fileChange(self, event) {
        event.stopPropagation();
        self.hideDropZone();

        if (self.fileReader.readyState === FileReader.LOADING) {
            self.fileReader.abort();
        }

        if (event.target && event.target.files && event.target.files[0]) {
            self.fileReader.readAsDataURL(event.target.files[0]);
        }
    }

    function fileReadInterruption(self, event) {
        self.setLoaderState('error');
        self.onError(event);
    }

    function fileReadLoadStart(self) {
        self.setProgress(0);
    }

    function fileReadLoad(self, event) {
        var target = event.target,
            image;

        if (target.readyState === FileReader.DONE) {
            self.setProgress(100);

            image = new Image();
            image.src = target.result;
            self.setLoaderState(loaderStates.SUCCESS);
            self.onImageLoad(image);
        }
    }

    function fileReadProgress(self, event) {
        self.setProgress(Math.round(event.loaded / event.total * 100));
    }

    function windowFocus(self) {
        if (fileDialogOpened) {
            self.hideDropZone();
            fileDialogOpened = false;
        }
    }

    function preventDefault(event) {
        event.preventDefault();
        return false;
    }

    function onFileDragEnter(self, event) {
        event.preventDefault();

        if (dragCollection.length === 0) {
            if (!fileDropZoneOpened) {
                self.showDropZone();
            }
            fileDropZoneOpened = true;
        }

        if (dragCollection.indexOf(event.target) < 0) {
            dragCollection.push(event.target);
        }
        return false;
    }

    function onFileDragLeave(self, event) {
        var itemIndex;
        event.preventDefault();

        itemIndex = dragCollection.indexOf(event.target);
        if (itemIndex >= 0) {
            dragCollection.splice(itemIndex, 1);
        }

        if (dragCollection.length === 0) {
            if (fileDropZoneOpened) {
                self.hideDropZone();
            }
            fileDropZoneOpened = false;
        }

        return false;
    }

    function onFileDrop(self, event) {
        event.preventDefault();

        if (fileDropZoneOpened) {
            self.hideDropZone();
        }
        fileDropZoneOpened = false;
        dragCollection = [];

        return false;
    }

    ImageLoader.prototype.init = function () {
        this.build();
        this.bindEvents();
    };

    ImageLoader.prototype.setProgress = function (progress) {
        this.setLoaderState('progress', Math.floor(progress / 10) * 10);
    };

    ImageLoader.prototype.setLoaderState = function (state, variant) {
        var stateClass;

        state = state.toLowerCase();
        switch (state) {
        case 'idle':
        case 'error':
        case 'success':
            stateClass = state;
            break;
        case 'progress':
            stateClass = state + '-' + variant;
            break;
        default:
            stateClass = '';
        }

        this.ui.element.className = 'btn ' + stateClass;
    };

    ImageLoader.prototype.build = function () {
        var input = document.createElement('input');

        input.type = 'file';
        input.accept = '.png';
        this.hiddenInput = input;
    };

    ImageLoader.prototype.bindEvents = function () {
        var fileReader = this.fileReader,
            bounds = {
                windowFocus: windowFocus.bind(null, this),
                elementClick: elementClick.bind(null, this),
                fileChange: fileChange.bind(null, this),
                fileReadAbort: fileReadInterruption.bind(null, this),
                fileReadError: fileReadInterruption.bind(null, this),
                fileReadLoadStart: fileReadLoadStart.bind(null, this),
                fileReadLoad: fileReadLoad.bind(null, this),
                fileReadProgress: fileReadProgress.bind(null, this),
                onDragOver: preventDefault.bind(null),
                onDragEnter: onFileDragEnter.bind(null, this),
                onDragLeave: onFileDragLeave.bind(null, this),
                onDrop: onFileDrop.bind(null, this)
            };

        this.ui.element.addEventListener('click', bounds.elementClick, true);
        this.hiddenInput.addEventListener('change', bounds.fileChange, true);

        fileReader.addEventListener('abort', bounds.fileReadAbort, false);
        fileReader.addEventListener('error', bounds.fileReadError, false);
        fileReader.addEventListener('loadstart', bounds.fileReadLoadStart, false);
        fileReader.addEventListener('load', bounds.fileReadLoad, false);
        fileReader.addEventListener('progress', bounds.fileReadProgress, false);

        window.addEventListener('focus', bounds.windowFocus, false);
        window.addEventListener('dragover', bounds.onDragOver, true);
        window.addEventListener('dragenter', bounds.onDragEnter, true);
        window.addEventListener('dragleave', bounds.onDragLeave, true);

        document.addEventListener('drop', bounds.onDrop, true);

        this.eventBounds = bounds;
    };

    ImageLoader.prototype.unbindEvents = function () {
        var fileReader = this.fileReader,
            bounds = this.eventBounds;

        this.ui.element.removeEventListener('click', bounds.elementClick, true);
        this.hiddenInput.removeEventListener('change', bounds.fileChange, true);

        fileReader.removeEventListener('abort', bounds.fileReadAbort, false);
        fileReader.removeEventListener('error', bounds.fileReadError, false);
        fileReader.removeEventListener('loadstart', bounds.fileReadLoadStart, false);
        fileReader.removeEventListener('load', bounds.fileReadLoad, false);
        fileReader.removeEventListener('progress', bounds.fileReadProgress, false);

        window.removeEventListener('focus', bounds.windowFocus, false);
        window.removeEventListener('dragover', bounds.onDragOver, true);
        window.removeEventListener('dragenter', bounds.onDragEnter, true);
        window.removeEventListener('dragleave', bounds.onDragLeave, true);

        document.removeEventListener('drop', bounds.onDrop, true);

        this.eventBounds = null;
    };

    ImageLoader.prototype.showDropZone = function (blurOnly) {
        var ui = this.ui,
            main = ui.documentMain,
            mainClone = main.cloneNode(true),
            dropZone = ui.dropZoneContainer;

        blurOnly = !!blurOnly;

        main.classList.add('hidden');
        mainClone.classList.add('clonned');

        if (!blurOnly) {
            dropZone.classList.remove('hidden');
        }

        main.parentElement.insertBefore(mainClone, dropZone);

        // Force to apply styles
        if (window.getComputedStyle(mainClone).filter) {
            mainClone.classList.add('blurred');
            dropZone.classList.add('faded');
        }

        // Cache props
        ui.clonedMain = mainClone;
    };

    ImageLoader.prototype.hideDropZone = function () {
        var ui = this.ui,
            main = ui.documentMain,
            mainClone = ui.clonedMain,
            dropZone = ui.dropZoneContainer;

        mainClone.classList.remove('blurred');
        dropZone.classList.remove('faded');

        setTimeout(function () {
            mainClone.parentElement.removeChild(mainClone);
            main.classList.remove('hidden');
            dropZone.classList.add('hidden');
        }, 400);

        // Cache props
        ui.clonedMain = null;
    };

    ImageLoader.prototype.destroy = function () {
        this.unbindEvents();
        this.hiddenInput = null;
        this.ui = null;
    };

    return ImageLoader;
}());
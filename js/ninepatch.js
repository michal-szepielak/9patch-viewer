/*jslint browser:true, plusplus:true*/
var NinePatch = (function () {
    'use strict';

    /**
     * @param img {Image} Target image from which should be preview created
     * @param previewContainer {HTMLElement} Container for preview
     * @constructor
     */
    var NinePatch = function (img, previewContainer) {
        this.canvas = null;
        this.previewContainer = previewContainer;
        this.createPreviewFromImage(img);
    };

    /**
     * Returns area which is cover by ninepatch guides.
     * @param imgData
     * @returns {Array} Found areas
     */
    function findArea(imgData) {
        var i, r, g, b, a,
            data = imgData.data,
            area = [],
            tmpArea,
            currentIsBlack = null,
            lastWasBlack = null,
            dataLength = data.length;

        // Omit first and last pixel from checking
        for (i = 4; i < dataLength - 4; i += 4) {
            r = data[i];
            g = data[i + 1];
            b = data[i + 2];
            a = data[i + 3];

            // Check if found black pixel
            currentIsBlack = r === 0 && g === 0 && b === 0 && a === 255;

            // Change is coming...
            if (currentIsBlack !== lastWasBlack) {
                if (tmpArea) {
                    area.push(tmpArea);
                }

                tmpArea = {
                    start: null,
                    stop: null,
                    size: null,
                    flexible: false
                };
            }

            // If area measurement is not started, start it
            if (tmpArea.start === null) {
                tmpArea.start = i / 4;
                tmpArea.size = 0;
                tmpArea.flexible = currentIsBlack;
            }
            tmpArea.stop = i / 4 + 1;
            tmpArea.size++;

            // Current became last
            lastWasBlack = currentIsBlack;
        }

        // Push last area if exists
        if (tmpArea) {
            area.push(tmpArea);
        }

        return area;
    }

    function getTileDataUrl(context, tile) {
        var tmpCanvas = document.createElement('canvas'),
            ctx = tmpCanvas.getContext('2d'),
            data;

        tmpCanvas.width = tile.sw;
        tmpCanvas.height = tile.sh;

        data = context.getImageData(tile.sx, tile.sy, tile.sw, tile.sh);

        ctx.putImageData(data, 0, 0);
        return tmpCanvas.toDataURL('image/png');
    }

    NinePatch.prototype.createPreviewFromImage = function (img) {
        var gridInfo;

        this.canvas = this.createCanvasFromImage(img);
        gridInfo = this.getGridInfo();
        this.createGrid(gridInfo.verticalStretches, gridInfo.horizontalStretches);
        this.setupContent(gridInfo.horizontalPadding, gridInfo.verticalPadding);
    };

    NinePatch.prototype.getGridInfo = function () {
        var canvas,
            context,
            edges,
            canvasWidth,
            canvasHeight;

        canvas = this.canvas;
        context = canvas.getContext('2d');
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;

        edges = {
            top: context.getImageData(0, 0, canvasWidth, 1),
            bottom: context.getImageData(0, canvasHeight - 1, canvasWidth, 1),
            left: context.getImageData(0, 0, 1, canvasHeight),
            right: context.getImageData(canvasWidth - 1, 0, 1, canvasHeight)
        };

        return {
            horizontalStretches: findArea(edges.top),
            verticalStretches: findArea(edges.left),
            horizontalPadding: findArea(edges.bottom),
            verticalPadding: findArea(edges.right)
        };
    };

    NinePatch.prototype.createCanvasFromImage = function (img) {
        var canvas = document.createElement('canvas'),
            imgWidth,
            imgHeight,
            context;

        imgWidth = img.naturalWidth;
        imgHeight = img.naturalHeight;

        // Set size of canvas
        canvas.width = imgWidth;
        canvas.height = imgHeight;

        context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        return canvas;
    };

    NinePatch.prototype.createCells = function (data, row) {
        var doc = document.createDocumentFragment(),
            context,
            item,
            tile,
            el,
            i;

        for (i = 0; i < data.length; i++) {
            item = data[i];
            el = document.createElement('td');

            // For flexible items let browser do the scaling
            if (!item.flexible) {
                el.style.width = item.size + 'px';
                el.style.minWidth = item.size + 'px';
            } else {
                el.classList.add('flexible');
            }

            tile = {
                sx: item.start,
                sy: row.start,
                sw: item.size,
                sh: row.size
            };

            context = this.canvas.getContext('2d');
            el.style.backgroundImage = 'url(' + getTileDataUrl(context, tile) + ')';
            doc.appendChild(el);
        }

        return doc;
    };

    NinePatch.prototype.createGrid = function (rowData, cellData) {
        var doc = document.createDocumentFragment(),
            item,
            cells,
            el,
            i;

        for (i = 0; i < rowData.length; i++) {
            item = rowData[i];
            el = document.createElement('tr');
            if (item.flexible) {
                el.classList.add('flexible');
            } else {
                el.style.height = item.size + 'px';
                el.style.minHeight = item.size + 'px';
            }
            cells = this.createCells(cellData, item);
            el.appendChild(cells);
            doc.appendChild(el);
        }

        el = document.createElement('table');
        el.appendChild(doc);
        this.previewContainer.appendChild(el);
    };

    NinePatch.prototype.setupContent = function (horizontal, vertical) {
        var container = document.getElementById('content-container'),
            containerStyle = container.style,
            area;

        // If there are multiple block, set the padding left
        if (horizontal.length > 1) {
            area = horizontal[0];
            containerStyle.paddingLeft = area.flexible ? '0' : area.size + 'px';
        } else {
            containerStyle.paddingLeft = 0;
        }

        // If there are at least 3 blocks, set padding right
        if (horizontal.length > 2) {
            area = horizontal[horizontal.length - 1];
            containerStyle.paddingRight = area.flexible ? '0' : area.size + 'px';
        } else {
            containerStyle.paddingRight = 0;
        }

        // If there are multiple block, set the padding top
        if (vertical.length > 1) {
            area = vertical[0];
            containerStyle.paddingTop = area.flexible ? '0' : area.size + 'px';
        } else {
            containerStyle.paddingTop = 0;
        }

        // If there are at least 3 blocks, set padding bottom
        if (vertical.length > 2) {
            area = vertical[vertical.length - 1];
            containerStyle.paddingBottom = area.flexible ? '0' : area.size + 'px';
        } else {
            containerStyle.paddingBottom = 0;
        }
    };

    NinePatch.prototype.destroy = function () {
        this.previewContainer.innerHTML = '';
    };

    return NinePatch;
}());
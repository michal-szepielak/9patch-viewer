/*jslint browser:true, plusplus:true*/
var SimpleFileLoader = (function () {
    'use strict';
    var SFL = function (buttonElement) {
        // Create input file element, but don't add it to document DOM
        var inputFile = document.createElement('input');

        inputFile.type = 'file';

        // Bound events
        this.clickButtonBound = this.onClickButton.bind(this);
        this.changeFileBound = this.onChangeFile.bind(this);

        buttonElement.addEventListener('click', this.clickButtonBound, false);
        inputFile.addEventListener('change', this.changeFileBound, false);

        this.inputFile = inputFile;
        this.buttonElement = buttonElement;
    };

    SFL.prototype.onClickButton = function () {
        this.inputFile.click();
    };

    SFL.prototype.onChangeFile = function () {
        var fr = new FileReader();
        fr.onload = function (e) {
            img.src = e.target.result;
        };
        fr.readAsDataURL(e.target.files[0]);
    };

    SFL.prototype.destroy = function () {
        this.buttonElement.removeEventListener('click', this.clickButtonBound, false);
        this.inputFile.addEventListener('change', this.changeFileBound, false);
    };


    return SFL;
})();
/*global NinePatch, ImageLoader, console*/
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    var uploadButton = document.getElementById('upload-button'),
        previewContainer = document.getElementById('preview-container'),
        img = new Image(),
        imageLoader,
        ninePatch,
        ui;

    // Load preview bubble
    img.onload = function () {
        ninePatch = new NinePatch(this, previewContainer);
    };
    img.src = 'img/preview.bubble.9.png';

    // Init image loader
    ui = {
        element: uploadButton,
        dropZoneContainer: document.querySelector('.drop-zone'),
        documentMain: document.querySelector('main')
    };
    imageLoader = new ImageLoader(ui, function (image) {
        if (ninePatch instanceof NinePatch) {
            ninePatch.destroy();
        }
        ninePatch = new NinePatch(image, previewContainer);

        document.getElementById('content-container').innerText = "Once you call it in, the people who show up with be with the office "
            + "of medical investigations. it's primarily who you'll talk to. Police"
            + "officers may arrive they may not, depends on how busy a morning"
            + "they're having. Typically ODs are not a high priority call. There's"
            + "nothing here to incriminate you, so I'd be amazed if you got placed"
            + "under arrest. However, if you do, you say nothing. You tell them you"
            + "just want your lawyer. And you call Saul Goodman.";

    }, function (error) {
        console.log(error);
    });
    imageLoader.init();

    var z = new SimpleResize(document.querySelector('.resize-handler'));
});

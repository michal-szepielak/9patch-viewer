document.addEventListener('DOMContentLoaded', function () {
    var uploadButton = document.getElementById('upload-button'),
        uploadInput = document.getElementById('upload-input'),
        previewContainer = document.getElementById('preview-container'),
        img = new Image(),
        ninePatch,
        sfl;

    sfl = new SimpleFileLoader(uploadButton);

    //
    //img.onload = function () {
    //    if (ninePatch instanceof NinePatch) {
    //        ninePatch.destroy();
    //    }
    //    ninePatch = new NinePatch(this, previewContainer);
    //
    //    document.getElementById('content-container').innerText = "Once you call it in, the people who show up with be with the office \
    //    of medical investigations. it's primarily who you'll talk to. Police\
    //    officers may arrive they may not, depends on how busy a morning\
    //    they're having. Typically ODs are not a high priority call. There's\
    //    nothing here to incriminate you, so I'd be amazed if you got placed\
    //    under arrest. However, if you do, you say nothing. You tell them you\
    //    just want your lawyer. And you call Saul Goodman.";
    //};
    //
    //function loadNinePatch(e) {
    //    var fr = new FileReader();
    //
    //    // @TODO: handle progress
    //    fr.onload = function (e) {
    //        img.src = e.target.result;
    //    };
    //    fr.readAsDataURL(e.target.files[0]);
    //}
    //
    //uploadButton.addEventListener('click', function () {
    //    uploadInput.click();
    //}, false);
    //uploadInput.addEventListener('change', loadNinePatch, false);
});

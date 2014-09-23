$(document).ready(function () {
    $("#cvs_note").jqScribble();
    $("#cvs_note").data("jqScribble").update({
        brushSize: 2,
        width: 285,
        height: 285,
        backgroundColor: 'rgba(255,255,255,0)'
    });


    $("#btnContinue").click(function () {
        if ($("#cvs_note").data("jqScribble").blank == false) {
            $("#cvs_note").data("jqScribble").save(function (imageData) {
                if (imageData != '' && imageData != 'data:,') {
                    $("#CommentImage").val(imageData);
                }
            });
        }
    });
});
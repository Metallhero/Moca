

function SqliteDate(date) {
    now = date;
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
var MocaTestTypes = {};
function FillMocaTypes() {
    MocaTestTypes["Trail"] = 13;
    MocaTestTypes["Cube"] = 14;
    MocaTestTypes["Clock"] = 15;
    MocaTestTypes["Naming"] = 9;
    MocaTestTypes["Memory1"] = 8;
    MocaTestTypes["Memory2"] = 18;
    MocaTestTypes["DigitForward"] = 2;
    MocaTestTypes["DigitBackward"] = 19;
    MocaTestTypes["LetterA"] = 3;
    MocaTestTypes["Calculation"] = 4;
    MocaTestTypes["Repetition"] = 6;
    //MocaTestTypes["RepetitionSecond"]   = 20;
    MocaTestTypes["Fluency"] = 7;
    MocaTestTypes["Abstraction"] = 1;
    MocaTestTypes["DelayedRecall"] = 5;
    MocaTestTypes["Orientation"] = 12;
}


var allPages = ["TrailInstructions", "TrailExecution", "TrailScoring", /*"CubeInstructions",*/ "CubeExecution", "CubeScoring", /*"ClockInstructions",*/ "ClockExecution", "ClockScoring",
        /*"NamingInstructions",*/"NamingExecution", "NamingScoring",/*"MemoryInstructions",*/"Memory1Execution", "Memory2Execution",
       /*"DigitForwardInstructions",*/"DigitForwardExecution",/*"DigitBackwardInstructions",*/ "DigitBackwardExecution",/*"LetterAInstructions",*/"LetterAExecution",
        /*"CalculationInstructions",*/"CalculationExecution",/*"RepetitionInstructions",*/"RepetitionExecution",/*"RepetitionExecution2",*/
         /*"FluencyInstructions", */ "FluencyExecution", /*"AbstractionInstructions",*/ "AbstractionExecution",
         /*"DelayedRecallInstructions",*/"DelayedRecallExecution",/*"OrientationInstructions",*/"OrientationExecution", "Comment"];
function allPagesWithExt(index) {
    return allPages[index] + ".html";
}

function GetCurrentPageIndex() {
    var index = -1;
    $.each(allPages, function (k, v) {
        var ind = window.location.href.toLowerCase().indexOf(v.toLowerCase());
        if (ind > -1) {
            index = k;
            return false;
        }
    });
    return index;
}
$(document).ready(function () {
    FillMocaTypes();
    if ($("#navigationBar")) {
        $("#navigationBar").load("Partial/_NavigationBar.html");
    }
    if ($("#testComment")) {
        $("#testComment").load("Partial/_TestComment.html");
    }
    $('.page-sidebar-menu > li > a').on('click', function (event) {
        if ($(this).find('.arrow').length) {
            if (!$(this).next().is(':visible')) {
                $('.sub-menu').slideUp();
                $('.arrow').removeClass('open');
                $(this).next().slideDown();
                $(this).find('.arrow').addClass('open');
            } else {
                $(this).next().slideUp();
                $(this).find('.arrow').removeClass('open');
            }

            return false;
        }
    });

    $('.footer').on('click', '.go-top', function (e) {
        $('html, body').animate({ scrollTop: 0 }, 400);
        e.preventDefault();
    });

    $("#btnContinue, #btnReset").click(function () {
        $.session.set('historyCounter', 0);
    });

    $("#btnContinue, #btnReset").click(function () {
        $.session.set('historyCounter', 0);
    });
    var index = GetCurrentPageIndex();
    if (index == 0) {
        $("#btnBack").addClass('disabledBtn');
    }
    var historyCounter = $.session.get('historyCounter');
    if (!historyCounter)
        historyCounter = 0;
    if (historyCounter > 0) {
        $("#btnFoward").removeClass('disabledBtn');
    }
    else {
        $("#btnFoward").addClass('disabledBtn');
    }


    //Chackbox switch
    $.fn.bootstrapSwitch.defaults.size = 'mini';

    $('.toggle:checkbox').bootstrapSwitch(
        {
            wrapperClass: 'chbx-wrapper',
            onText: '',
            offText: '',
            onInit: function () {
                $(".bootstrap-switch-chbx-wrapper .bootstrap-switch-container .bootstrap-switch-handle-on").addClass("icon-ok");
                $(".bootstrap-switch-chbx-wrapper .bootstrap-switch-container .bootstrap-switch-handle-off").addClass("icon-remove");
            },
        }

        );

    //////
    //DropDown////////////
    $(".select2").select2({
        placeholder: "Select",
        allowClear: true
    });
    ////////////////////////

});
$(document).on('click', '.expand, .collapse', function (e) {
    var el = jQuery(this).closest(".portlet").children(".portlet-body");
    if ($(this).hasClass("collapse")) {
        jQuery(this).removeClass("collapse").addClass("expand");
        el.slideUp(200, function () {
        });

    } else {
        jQuery(this).removeClass("expand").addClass("collapse");
        el.slideDown(200, function () {
        });
    }
});

$(document).on('keydown drop', '.integer', function (event) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(event.keyCode, [46, 8, 9, 27, 13 /*, 190*/]) !== -1 ||
        // Allow: Ctrl+A
        (event.keyCode == 65 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
    }
    else if (event.type == "drop") {
        event.preventDefault();
    }
    else {
        // Ensure that it is a number and stop the keypress
        if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
            event.preventDefault();
        }
    }
});

function log(msg) {
    console.log(msg);
}
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function NextPage() {
    var historyCounter = $.session.get('historyCounter');
    if (historyCounter > 0) {
        var historyCounter = $.session.get('historyCounter');
        historyCounter--;
        $.session.set('historyCounter', historyCounter);
        var index = GetCurrentPageIndex();
        window.location = allPagesWithExt(++index);
    }
}
function NextTest() {
    var index = GetCurrentPageIndex();
    window.location = allPagesWithExt(++index);
}

function PreviousPage() {
    var index = GetCurrentPageIndex();
    if (index != 0) {
        var historyCounter = $.session.get('historyCounter');
        historyCounter++;
        $.session.set('historyCounter', historyCounter);
        window.location = allPagesWithExt(--index);
    }
}

function ShowConfirmPopup(title, body, onclickEvent) {
    $.get("Partial/PopupConfirm.html",
    function (data) {
        $("#popups").append(data);
        $("#popup-confirm").bPopup({
            onOpen: function () {
                $('#popup-title').text(title);
                $('#popup-body').text(body);
                if (onclickEvent.indexOf('.html') > -1)
                    $('#popup-sbmt').attr('onclick', "window.location='" + onclickEvent + "'");
                else
                    $('#popup-sbmt').attr('onclick', onclickEvent);

            },
            onClose: function () {
                $("#popup-confirm").remove();
            }
        });
    });
}
function ShowAlertPopup(title) {
    $.get("Partial/PopupAlert.html",
    function (data) {
        $("#popups").append(data);
        $("#popup-alert").bPopup({
            onOpen: function () {
                $('#popup-title').text(title);
            },
            onClose: function () {
                $("#popup-alert").remove();
            }
        });
    });
}
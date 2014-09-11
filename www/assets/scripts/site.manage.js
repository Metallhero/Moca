var networkArray = {
    localhost: "http://localhost:3753/",
    internalNetwork: "http://10.47.100.56:3434/",
    externalNetwork: "http://91.203.63.113:3434/"
}
function dateToWcf(date) {
    if (isNaN(date)) return null;
    return '\/Date(' + date.getTime() + '-0000)\/';
}


var currentNetwork = networkArray.internalNetwork;
var allPageNumbers = ['_1_1', '_1_2', '_1_3', '_2_1', '_2_2', '_2_3', '_3_1', '_3_2', '_3_3', '_4_1', '_4_2', '_4_3', '_5_1', '_5_2', '_5_3', '_6_1', '_6_2',
    '_7_1', '_7_2', '_8_1', '_8_2', '_9_1', '_9_2', '_10_1', '_10_2', '_10_3', '_11_1', '_11_2', '_12_1', '_12_2', '_13_1', '_13_2',  
    '_14_1', '_14_2', '_15_1'];

function NextLocation(maxStep) {
    var href = window.location.href;
    var index = href.lastIndexOf('_');
    var stepId = parseInt(href.substring(href.lastIndexOf('_') + 1));
    var testId = href.substring(0, index);
    testId = parseInt(testId.substring(testId.lastIndexOf('_') + 1));
    if (stepId >= maxStep) { stepId = 1; testId = testId + 1; } else {
        stepId = stepId + 1;
    }
    window.location = 'test_' + testId + '_' + stepId + '.html';
}
 
$(document).ready(function () {
    $("#btnContinue").click(function () {
        console.log('sd');
        $.session.set('historyCounter',0);
    });

    var historyCounter = $.session.get('historyCounter');
    if (!historyCounter)
        historyCounter = 0;
    if (historyCounter > 0) {
        $("#btnFoward").fadeTo(0, '1');
    }
    else {
        $("#btnFoward").css({'opacity': 0.5});
    }
});

function PreviousPage() {
    var href = window.location.href;
    var arr = href.split('test');
    var currentPageNumber = arr[arr.length - 1].split('.')[0];
    var index = allPageNumbers.indexOf(currentPageNumber);
    if (index > 0) {
        var historyCounter = $.session.get('historyCounter');
        historyCounter++;
        $.session.set('historyCounter', historyCounter);
        window.location = "test" + allPageNumbers[--index] + ".html";
    }
    else
    {
        window.history.go(-1);
    }
}



function NextPage() {
    var historyCounter = $.session.get('historyCounter');
    if (historyCounter > 0) {
        var href = window.location.href;
        var arr = href.split('test');
        var currentPageNumber = arr[arr.length - 1].split('.')[0];
        var index = allPageNumbers.indexOf(currentPageNumber);
        var historyCounter = $.session.get('historyCounter');
        historyCounter--;
        $.session.set('historyCounter', historyCounter);
        window.location = "test" + allPageNumbers[++index] + ".html";
    }
}

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

function getURLParameters(url) {
    url = url.split("#")[0];
    var result = {};
    var searchIndex = url.indexOf("?");
    if (searchIndex == -1) return result;
    var sPageURL = url.substring(searchIndex + 1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        result[sParameterName[0]] = sParameterName[1];
    }
    return result;
}
function getTestResultSymbol(valueResult) {
    if (valueResult == null)
        return "";
    return valueResult ? "✔" : 'x';
}

function goForward() {
    console.log('click');
    NextLocation(GetMaxStep(DB.GetTestType()));
}











 
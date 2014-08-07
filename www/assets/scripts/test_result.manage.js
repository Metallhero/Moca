function GetTestResult() {

    var testId = $.session.get('testId');
    var testType = DB.GetTestType();
    //if (testType == 16 || testType == 17) {
    //    DB.selectData(DB.DelayedRecallPreviousAnswersQuery(testId), function (results) {
    //        var resultData = [];
    //        for (var i = 0; i < results.rows.length; i++) {
    //            var resultValue = results.rows.item(i);
    //            resultData.push(resultValue);
    //        }
    //        $.each(resultData, function (index, value) {
    //            if (value.valueResult) {
    //                $("#cbx" + value.valueOptional).closest('.make-switch').bootstrapSwitch('setState', true);
    //                $("#cbx" + value.valueOptional).closest('.make-switch').bootstrapSwitch('setActive', false);
    //            }
    //        });
    //    });
    //}


    DB.GetTestResult(testId, testType, function (results) {

        if (results != null) {
            LoadPreviousResult(results);
        }
        else {
            LoadFirstAttempt();
        }


    });

}
function LoadFirstAttempt() {
    log("LoadFirstAttempt");
    $('#timeBlock').text($.session.get('timeTest') + ' s');
    Recalculate();
    LoadImage();
    var testType = DB.GetTestType();
    if (testType == 7) {
        StartTimer();
    }

}
function LoadPreviousResult(data) {
    log("LoadPreviousResult");
    var mocaResult = data.MocaTestResults.data[0];
    var mocaResultValues = data.MocaTestResultsValues.data;


    if (mocaResult.testTypeID == 7) { //11words
        $('.timeBlock').show();
        $("#timerInfoBlock").remove();
        $(".spinner").hide();
    }
    else if (mocaResult.testTypeID == 4) {//100,93,86 test
        $.each(mocaResultValues, function (index, value) {
            var chkBoxIndex = 93 - parseInt(index) * 7;
            $("#cbx" + chkBoxIndex).val(value.valueOptional.split("|")[1]);
        });
    }
    else if (mocaResult.testTypeID == 3) {//AAAAAAAAAAAA test
        $("input:checkbox.cb").each(function () {
            if ($(this).is(':checked')) {
                $(this).click();
            }
        });
    }

    $('#timeBlock').text(mocaResult.timeTest + ' s');
    $.each(mocaResultValues, function (index, value) {
        var itemIndex = parseInt(index) + 1;
        if (mocaResult.testTypeID == 3) //AAAAAAAAAAAA test Clear ALl Cahes resulats
        {
            var chkBoxIndex = value.valueOptional;
            if (!$("#cb" + chkBoxIndex).is(':checked')) {
                $("#cb" + chkBoxIndex).click();
            }
        }
        else if (mocaResult.testTypeID == 7) //11 words
        {
            $("#tbx1").val(value.valueOptional);
        }
        else {
            if (value.valueResult && !$("#cbx" + itemIndex).is(':checked')) {
                $("#cbx" + itemIndex).click();
            }
            else if (!value.valueResult && $("#cbx" + itemIndex).is(':checked')) {
                $("#cbx" + itemIndex).click();
            }
            $("#naming_0" + itemIndex).val(value.valueOptional.split("|")[1]); //naming
        }
    });
    Recalculate();
    LoadImage();
}
function SaveImage() {
    if (!$("#visuoexec").attr('src')) {
        $("#visuoexec").data("jqScribble").save(function (imageData) {
            if (imageData != '' && imageData != 'data:,') {
                var testId = $.session.get('testId');
                var testType = DB.GetTestType();
                var mocaImageData =
                 {
                     tableName: 'MocaImage',
                     data: [{
                         testID: testId,
                         testTypeID: testType,
                         Data: imageData
                     }]
                 };

                // DB.deleteData(DB.DeleteImageQuery(testId, testType), function () {
                //                       
                DB.insertData(mocaImageData, function (data) {

                });
                // });

            }
        });
    }
}


function LoadImage() {
    var testId = $.session.get('testId');
    var testType = DB.GetTestType();

    DB.selectData(DB.SelectImageQuery(testId, testType), function (results) {
        if (results.rows.length > 0) {
            var imgData = results.rows.item(0).Data;

            var container = $("#visuoexec").parent();
            $("#visuoexec").remove();
            var className = 'visuoImg_norev';
            if (DB.GetTestType() == 13)//A1B2C3...
            {
                className = 'visuoImg1_norev';
            }
            else if (DB.GetTestType() == 7) {
                className = 'cnvs_word';
            }
            container.html('<img id="visuoexec" class="' + className + '" src="' + imgData + '" alt="" />')
        }
    });
}

function Recalculate() {
    if (DB.GetTestType() == 7) {
        if ($('#tbx1').val() >= 11)
            $("#score").text(1);
        else
            $("#score").text(0);
    }
    else if (DB.GetTestType() == 3) { //AAAAAAAAAAAAAAA
        var count = 0;
        $("input:checkbox.cb").each(function () {
            var indexPtd = $(this).closest('td').index();
            var indexPtr = $(this).closest('tr').prev();

            if ($(this).is(':checked')) {
                count++;
            }
        });
        if (count >= 2) { count = 0; } else { count = 1; }
        $("#score").text(count);
    }
    else if (DB.GetTestType() == 5) {
        var count = 0;
        for (var i = 1; i <= 5; i++) {
            if ($(".col_" + i + ":checked").length > 0) {
                $(".col_" + i + ":not(:checked)").closest('.make-switch').bootstrapSwitch('setActive', false);
                var inputIndex = $(".col_" + i + ":checked").attr('id').replace("cbx", "");
                if (inputIndex <= 5)//firstRow add points
                    count++;
            }
            else {
                $(".col_" + i + ":not(:checked)").closest('.make-switch').bootstrapSwitch('setActive', true);
            }
        }
        $("#score").text(count);
    }
    else if (DB.GetTestType() == 4) { //100,93,
        var count = 0;
        $('.numeric').each(function () {
            var inputIndex = $(this).attr('id').replace("cbx", "");
            var compareValues = 93;
            if (inputIndex != 93) {
                var prevIndex = parseInt(inputIndex) + 7;
                compareValues = parseInt($("#cbx" + prevIndex).val()) - 7;

            }
            if ($(this).val() == compareValues) {
                count++;
            }

        });

        if (count >= 4 && count <= 5) {
            $("#score").text(3);
        }
        else if (count >= 2 && count <= 3) {
            $("#score").text(2);
        }
        else if (count == 1) {
            $("#score").text(1);
        }
        else if (count == 0) {
            $("#score").text(0);
        }
    }
    else {
        var count = 0;
        $('.toggle').each(function () {
            if ($(this).is(':checked')) {
                count++;
            }
        });
        $("#score").text(count);
    }
}



function StartTimer() {
    var start = 0;
    var timer = setInterval(function () {
        var time;
        if (start < 10) { start = '0' + start; }
        if (start < 60) {
            time = start;
        } else {
            time = 'PLEASE STOP';
            clearInterval(timer);
            var audio = new Audio('audio/bud.mp3');
            audio.play();

        }

        $('#up_Timer').html('<span id="up_Timer"><i class="icon-bell"></i> <span id="timerTime">' + time + '</span></span>');
        $("#timeBlock").text(start);
        start++;
    }, 1000);
}



$(function () {
    function SaveComments(testId, testType) {
        DB.deleteData(DB.DeleteCommentQuery(testId, testType), function () { //if drow img
            if ($("#cvs_note").data("jqScribble").blank == false) {
                $("#cvs_note").data("jqScribble").save(function (imageData) {
                    if (imageData != '' && imageData != 'data:,') {
                        var testId = $.session.get('testId');
                        var comment = $("#TB_Note").val();
                        var mocaComment =
                         {
                             tableName: 'MocaComments',
                             data: [{
                                 testID: testId,
                                 testTypeID: testType,
                                 caneva: imageData,
                                 comment: comment
                             }]
                         };
                        DB.insertData(mocaComment, function (data) {
                            NextLocation(GetMaxStep(testType));
                        });

                    }
                });
            }
            else if ($("#TB_Note").val() != '') { //if not drow img but fill textarea
                var comment = $("#TB_Note").val();
                var mocaComment =
                 {
                     tableName: 'MocaComments',
                     data: [{
                         testID: testId,
                         testTypeID: testType,
                         comment: comment
                     }]
                 };
                DB.insertData(mocaComment, function (data) {
                    NextLocation(GetMaxStep(testType));
                });
            }
            else {
                NextLocation(GetMaxStep(testType));
            }
        });
    }

    GetTestResult();
    var start = new Date();
    $("#btnReset").on('click', function () {
        log('click');
        var testId = $.session.get('testId');
        var testType = DB.GetTestType();
        DB.ResetTest(testId, testType, function (result) {
            log(result);
            if (result) {
                $.session.set('timeTest', '0');
                window.location = window.location;
            }
        });

    });

    $("#btnContinue").click(function () {


        ///time
        var end = new Date();
        var time = Math.floor((end - start) / 1000);
        if ($("#timeBlock").length > 0) {
            time = parseInt($("#timeBlock").text())
        }
        ///score/////
        var score = 0;
        if ($("#score").length > 0) {
            score = parseInt($("#score").text());
        }
        /////////////
        var testId = $.session.get('testId');
        var testType = DB.GetTestType();
        var ResultValues = [];
        if (DB.GetTestType() == 7) //11 words
        {
            SaveImage();
            var val = { valueResult: parseInt($("#score").text()), valueOptional: $("#tbx1").val() };
            ResultValues.push(val);
        }
        else if (DB.GetTestType() == 3) { ///AAAAAAA test
            $("input:checkbox.cb").each(function () {
                if ($(this).is(':checked')) {
                    var cbIndex = $(this).attr("id").replace("cb", "");
                    var val = { valueResult: 0, valueOptional: cbIndex };
                    ResultValues.push(val);
                }
            });
            if (ResultValues.length == 0) {
                ResultValues.push({ valueResult: 1 });
            }
        }
        else if (DB.GetTestType() == 4)//100,93...
        {
            var index = 1;
            $('.numeric').each(function () {
                var inputIndex = $(this).attr('id').replace("cbx", "");
                var compareValues = 93;
                if (inputIndex != 93) {
                    var prevIndex = parseInt(inputIndex) + 7;
                    compareValues = parseInt($("#cbx" + prevIndex).val()) - 7;
                }

                if ($(this).val() == compareValues) {
                    var val = { valueResult: 1, valueOptional: index + "|" + $(this).val() };
                    ResultValues.push(val);
                }
                else {
                    var val = { valueResult: 0, valueOptional: index + "|" + $(this).val() };
                    ResultValues.push(val);
                }
                index++;
            });

        }
        else {
            $('.toggle').each(function () {
                var cbIndex = $(this).attr("id").replace("cbx", "");
                var val = {};
                if (DB.GetTestType() == 9) {//camel,rhino...
                    val = { valueResult: $(this).is(':checked') ? 1 : 0, valueOptional: cbIndex + "|" + $("#naming_0" + cbIndex).val() };
                }
                else {
                    var valRes = $(this).is(':checked') ? 1 : 0;
                    if ($(this).is(':checked') && $(this).is(':disabled')) {
                        valRes = 0;
                    }
                    val = { valueResult: valRes, valueOptional: cbIndex };
                }
                ResultValues.push(val);
            });
        }
 
        var testResultData =
         {
             MocaTestResults: {
                 tableName: 'MocaTestResults',
                 data: [{
                     testID: testId,
                     testTypeID: testType,
                     score: score,
                     timeTest: time
                 }]
             },
             MocaTestResultsValues: {
                 tableName: 'MocaTestResultsValues',
                 data: ResultValues
             }

         };
        log(testResultData);
        DB.AddTestResult(testResultData, function (results) {
            //Save Comments
            var testWithComments = [13, 14, 15, 9, 7];
            if (testWithComments.indexOf(testType) != -1) {
                SaveComments(testId, testType);
            }
            else if (testType == 5 || testType == 16) //Delayed recall
            {
                var count = 0;
                $('.toggle').each(function () {
                    if ($(this).is(':checked')) {
                        count++;
                    }
                });

                if (count == 5) {
                    NextLocation(1);
                }
                else {
                    NextLocation(GetMaxStep(testType));
                }
            }
            else {
                NextLocation(GetMaxStep(testType));
            }
        });
    });
    $("input:checkbox.cb, .toggle, .numeric").change(function () {
        Recalculate();
    });
    $('.spinner').click(function () {
        Recalculate();
    });


    function GetMaxStep(testType) {
        var maxStep = 3;
        //if (testType == 17 || testType == 16)
        //    maxStep = 4;
          if (testType == 2 || testType == 5 || testType == 19 || testType == 3 || testType == 4 || testType == 7 || testType == 1 || testType == 12)
            maxStep = 2;
        return maxStep;
    }

});



var Charts = function () {

    return {
        //main function to initiate the module

        init: function () {

            App.addResponsiveHandler(function () {

            });

        },

        initCharts: function () {

            if (!jQuery.plot) {
                return;
            }

            var data = [];
            var totalPoints = 250;

            // chart5(false);
        },
    };

}();

function getRandomData() {
    if (data.length > 0) data = data.slice(1);
    // do a random walk
    while (data.length < totalPoints) {
        var prev = data.length > 0 ? data[data.length - 1] : 50;
        var y = prev + Math.random() * 10 - 5;
        if (y < 0) y = 0;
        if (y > 100) y = 100;
        data.push(y);
    }
    // zip the generated y values with the x values
    var res = [];
    for (var i = 0; i < data.length; ++i) res.push([i, data[i]])
    return res;
}

//Basic Chart
//IMPORTANT
function GetData(type, isGrouping) {
    var returnValue;

    $.ajax({
        type: "POST",
        async: false,
        url: "chart.aspx/GetData",
        data: "{id:" + $("#hClientId").val() + ", type:" + type + ", isGrouping:" + isGrouping + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            returnValue = data.d;
        }
    });
    return returnValue;
}

//IMPORTANT
function chart5(isGrouping) {
    $('#chart_title').text('');
    $('#chart_title2').text('');
    $("#chart_5").hide();
    $("#chart_6").hide();

    $("#loader").show();

    var arrdata = [];
    var jsondata = GetData(1, isGrouping);
    arrdata = jsondata.split('@');

    var d1 = [];
    for (var i = 0; i < arrdata.length; i += 1) {
        var part = arrdata[i].split('#');
        var d2 = [];
        if (part.length > 1) {
            var item = part[1].split(';')

            for (var j = 0; j < item.length; j += 1) {
                var val = item[j].split(',')
                d2.push([val[0], parseInt(val[1])]);
            }
        }
        d1.push({ label: part[0], data: d2 });
    }

    var stack = 0,
        bars = true,
        lines = false,
        steps = false;
    var plot;

    function plotWithOptions() {
        $("#loader").hide();
        $("#chart_5").show();
        $('#chart_title').text('Total score');
        plot = $.plot($("#chart_5"), d1, {
            series: {
                stack: stack,
                lines: {
                    show: lines,
                    fill: true,
                    steps: steps
                },
                bars: {
                    show: bars,
                    barWidth: 0.6,//new Date(1970,0,10).getTime()
                    align: "center"
                }
            },
            xaxis: {
                mode: "categories",
                tickLength: 0,
                labelWidth: 10,
                panRange: [-1, 100],
                autoscaleMargin: 0.1,
                max: 7

            },
            yaxis: {
                min: 0
            },

            pan: {
                interactive: true
            }
        });
    }

    $(".stackControls input").click(function (e) {
        e.preventDefault();
        stack = $(this).val() == "With stacking" ? true : null;
        plotWithOptions();
    });

    plotWithOptions();
}

//IMPORTANT
function chart6(isGrouping) {
    $('#chart_title').text('');
    $('#chart_title2').text('');
    $("#chart_5").hide();
    $("#chart_6").hide();

    $("#loader").show();

    var arrdata = [];
    var jsondata = GetData(2, isGrouping);
    arrdata = jsondata.split('@')

    var d1 = [];
    for (var i = 0; i < arrdata.length; i += 1) {
        var part = arrdata[i].split('#')
        var d2 = [];
        if (part.length > 1) {
            var item = part[1].split(';')

            for (var j = 0; j < item.length; j += 1) {
                var val = item[j].split(',')
                d2.push([val[0], parseInt(val[1])]);
            }
        }
        d1.push({ label: part[0], data: d2 });

    }

    var stack = 0,
        bars = true,
        lines = false,
        steps = false;

    function plotWithOptions() {
        $("#loader").hide();
        $("#chart_5").show();
        $('#chart_title').text('Total time');
        $.plot($("#chart_5"), d1, {
            series: {
                stack: stack,
                lines: {
                    show: lines,
                    fill: true,
                    steps: steps
                },
                bars: {
                    show: bars,
                    barWidth: 0.6,//new Date(1970,0,10).getTime()
                    align: "center"
                }
            },
            xaxis: {
                mode: "categories",
                tickLength: 0,
                labelWidth: 10,
                panRange: [-1, 100],
                autoscaleMargin: 0.1,
                max: 7

            },

            yaxis: {
                mode: "time",
                minTickSize: [1, "second"],
                min: 0
            },
            //yaxis: {
            //    min: 0
            //},
            pan: {
                interactive: true
            }
        });
    }

    $(".stackControls input").click(function (e) {
        e.preventDefault();
        stack = $(this).val() == "With stacking" ? true : null;
        plotWithOptions();
    });

    plotWithOptions();
}

//IMPORTANT
function chart7() {
    $('#chart_title').text('');
    $('#chart_title2').text('');
    $("#chart_5").hide();
    $("#chart_6").hide();

    $("#loader").show();

    var arrdata = [];
    var jsondata = GetData(3, false);
    arrdata = jsondata.split(';')

    var d1 = [];
    var d2 = [];
    for (var i = 0; i < arrdata.length; i += 1) {
        var val = arrdata[i].split(',')

        d1.push([val[0], parseInt(val[1])]);
        d2.push([val[0], parseInt(val[2])]);
    }

    var stack = 0,
        bars = true,
        lines = false,
        steps = false;

    function plotWithOptions() {
        $("#loader").hide();
        $("#chart_5").show();

        $('#chart_title').text('MIS');
        $.plot($("#chart_5"), [d1], {
            series: {
                stack: stack,
                lines: {
                    show: lines,
                    fill: true,
                    steps: steps
                },
                bars: {
                    show: bars,
                    barWidth: 0.6,//new Date(1970,0,10).getTime()
                    align: "center"
                }
            },
            xaxis: {
                mode: "categories",
                tickLength: 0,
                labelWidth: 10,
                panRange: [-1, 100],
                autoscaleMargin: 0.1,
                max: 7

            },
            yaxis: {
                min: 0,
                max: 15
            },
            pan: {
                interactive: true
            }
        });

        $('#chart_title2').text('Score');
        $("#chart_6").show();
        $.plot($("#chart_6"), [d2], {
            series: {
                stack: stack,
                lines: {
                    show: lines,
                    fill: true,
                    steps: steps
                },
                bars: {
                    show: bars,
                    barWidth: 0.6,
                    align: "center"
                }
            },
            xaxis: {
                mode: "categories",
                tickLength: 0,
                labelWidth: 10,
                panRange: [-1, 100],
                autoscaleMargin: 0.1,
                max: 7

            },
            yaxis: {
                min: 0,
                max: 32
            },
            pan: {
                interactive: true
            }
        });
    }

    $(".stackControls input").click(function (e) {
        e.preventDefault();
        stack = $(this).val() == "With stacking" ? true : null;
        plotWithOptions();
    });

    plotWithOptions();
}


//IMPORTANT
function GetTestData(isIndividual) {
    var returnValue;

    var funcName = "GetData";
    if (isIndividual)
        funcName = "GetIndividualData";

    $.ajax({
        type: "POST",
        async: false,
        url: "chart_test.aspx/" + funcName,
        data: "{id:" + $("#hTestId").val() + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            returnValue = data.d;
        }
    });
    return returnValue;
}

//IMPORTANT
function chart8() {
    $('#chart_title').text('');
    $('#chart_title2').text('');
    $("#chart_1").hide();
    $("#chart_2").hide();
    $("#chart_3").hide();
    $("#chart_4").hide();
    $("#chart_5").hide();
    $("#chart_6").hide();

    $("#loader").show();

    var d = [];
    var arrdata = [];
    var jsondata = GetTestData(false);

    var testdata = jsondata.split('$');
    for (var k = 0; k < testdata.length; k += 1) {
        var testItem = testdata[k].split('#');
        var date = testItem[0];

        arrdata = testItem[1].split(';')

        var d1 = [];
        var d2 = [];
        var d3 = [];
        var d4 = [];

        var val = arrdata[0].split(',')
        for (var i = 0; i < val.length; i += 1) {
            var item = val[i].split(':');
            var resItem = item[1].split('*');
            d1.push([item[0], parseInt(resItem[0])]);
            d3.push([item[0], parseInt(resItem[1])]);
        }
        d.push([date, d1, d3]);

        var val = arrdata[1].split(',')
        for (var i = 0; i < val.length; i += 1) {
            var item = val[i].split(':');
            var resItem = item[1].split('*');
            d2.push([item[0], parseInt(resItem[0])]);
            d4.push([item[0], parseInt(resItem[1])]);
        }
        d.push([date, d2, d4]);

    }
    var stack = 0,
        bars = true,
        lines = false,
        steps = false;

    function plotWithOptions() {
        $("#loader").hide();

        for (var i = 0; i < d.length; i++) {
            var cur = Number(i + 1);
            $("#chart_" + cur).show();
            if (cur % 2 != 0) {
                $("#lbTestDate" + Number(cur - i / 2)).text(d[i][0]);
                $('#chart_title' + cur).text('Score');
                $.plot($("#chart_" + cur), [d[i][2],d[i][1]], {
                    colors: ["#E80000", "#00CC00"],
                    series: {
                        stack: null,
                        lines: {
                            show: lines,
                            fill: true,
                            steps: steps
                        },
                        bars: {
                            show: bars,
                            barWidth: 0.8,//new Date(1970,0,10).getTime()
                            align: "center"
                        }
                    },
                    xaxis: {
                        mode: "categories",
                        tickLength: 0,
                        panRange: [-1, 100]//,
                        //autoscaleMargin: 0.1//,
                        //max: 7

                    },
                    yaxis: {
                        min: 0,
                        //max: 15
                    },
                    pan: {
                        interactive: true
                    }
                });
            }
            else {
                $('#chart_title' + cur).text('Time');
                $("#chart_" + cur).show();
                $.plot($("#chart_" + cur), [d[i][2],d[i][1]], {
                    colors: ["#E80000", "#00CC00"],
                    series: {
                        stack: null,
                        lines: {
                            show: lines,
                            fill: true,
                            steps: steps
                        },
                        bars: {
                            show: bars,
                            barWidth: 0.8,
                            align: "center"
                        }
                    },
                    xaxis: {
                        mode: "categories",
                        tickLength: 0,
                        panRange: [-1, 100]//,
                        //font: { transform: rotate(-90deg); }

                        //,
                        //autoscaleMargin: 0.1//,
                        // max: 7

                    },
                    yaxis: {
                        mode: "time",
                        minTickSize: [1, "second"],
                        min: 0
                    },
                    //yaxis: {
                    //    min: 0,
                    //    // max: 30
                    //},
                    pan: {
                        interactive: true
                    }
                });
            }
        }
    }

    $(".stackControls input").click(function (e) {
        e.preventDefault();
        stack = $(this).val() == "With stacking" ? true : null;
        plotWithOptions();
    });

    plotWithOptions();

}

function chart_individual()
{
    $('#chart_title_score').text('');
    $('#chart_title_time').text('');
    $("#chart_score").hide();
    $("#chart_time").hide();

    $("#loader").show();

    var arrdata = [];
    var jsondata = GetTestData(true);
    arrdata = jsondata.split(';')

    var d1 = [];
    var d2 = [];
    for (var i = 0; i < arrdata.length; i += 1) {
        var val = arrdata[i].split(',')

        d1.push([val[0], parseInt(val[1])]);
        d2.push([val[0], parseInt(val[2])]);
    }

    var stack = 0,
        bars = true,
        lines = false,
        steps = false;

    function plotWithOptions() {
        $("#loader").hide();
        $("#chart_score").show();

        $('#chart_title_score').text('Individual Score');
        $.plot($("#chart_score"), [d1], {
            series: {
                stack: stack,
                lines: {
                    show: lines,
                    fill: true,
                    steps: steps
                },
                bars: {
                    show: bars,
                    barWidth: 0.6,//new Date(1970,0,10).getTime()
                    align: "center"
                }
            },
            xaxis: {
                mode: "categories",
                tickLength: 0,
                panRange: [-1, 100]//,
                //autoscaleMargin: 0.1//,
                //max: 7

            },
            yaxis: {
                min: 0,
                //max: 15
            },
            pan: {
                interactive: true
            }
        });

        $('#chart_title_time').text('Individual time');
        $("#chart_time").show();
        $.plot($("#chart_time"), [d2], {
            series: {
                stack: stack,
                lines: {
                    show: lines,
                    fill: true,
                    steps: steps
                },
                bars: {
                    show: bars,
                    barWidth: 0.6,
                    align: "center"
                }
            },
            xaxis: {
                mode: "categories",
                tickLength: 0,
                panRange: [-1, 100]//,
                //autoscaleMargin: 0.1//,
                //max: 7

            },
            yaxis: {
                mode: "time",
                minTickSize: [1, "second"],
                min: 0
            },
            //yaxis: {
            //    min: 0,
            //    //max: 15
            //},
            pan: {
                interactive: true
            }
        });
    }

    plotWithOptions();
}
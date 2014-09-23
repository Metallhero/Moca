




$(document).ready(function () {
    $('.navbar-toggle').remove();
    var date = new Date();
    var end = date.getFullYear();
    var start = date.getFullYear() - 100;
    $('#BirthDay').combodate({
        minYear: start,
        maxYear: end,
        customClass: "select2DT",
        errorClass: "invalidDate"
    });


    $(".select2DT").select2({
        placeholder: "Select",
        allowClear: false,
    });

    $('#ddlSex').easyDropDown();
});
$(window).load(function () {
    $('#regPatient .select2-container').css({ 'width': '131px' });
})


/////////////////////////////////////////////////////////////////////

$("#btnSubmitDll").click(function () {
    if ($("#ddlPatients").find("option:selected").val()) {
        var patientId = $("#ddlPatients").find("option:selected").val();
        console.log(patientId)
        $.session.set('clientId', patientId);
        window.location = "start.html";
    } else {
        ShowAlertPopup("Please create a new patient!");
    }
    return false;

});

$(document).ready(function () {
    DB.selectData('select * from MocaTestClients', function (data) {
        for (var i = 0; i < data.rows.length; i++) {
            var v = data.rows.item(i);
            var option = $('<option>', {
                text: v.name + ' | ' + v.physican,
                value: v.clientID
            });
            $('#ddlPatients').append(option);
        };
        $('#ddlPatients').select2({
            placeholder: "Select",
            allowClear: true
        });
    });

});


$("#btnSubmit").click(function () {
    var birthDay = new Date($("#ddlYear option:selected").val(), parseInt($("#ddlMonth option:selected").val()) - 1, $("#ddlDay option:selected").val())
    var date = SqliteDate(birthDay);

    var patient =
      {
          tableName: 'MocaTestClients',
          data: [{
              name: $("#txtName").val(),
              dateOfBirth: date, // wcfDate,
              gender: $("#ddlSex").find("option:selected").val(),
              physican: $("#txtPhysican").val(),
              education: $("#txtEducation").val(),
              chartNumber: $("#txtChartNumber").val()
          }]
      };

    var text = '';

    var out = patient.data[0];
    if (out.name && out.physican && out.education && out.chartNumber && !$('.invalidDate').length>0) {
        DB.insertData(patient, function (data) {
            log(data);
            $.session.set('clientId', data.insertId);
            window.location = "start.html";
        });
    } else {

        ValidateFields($('#txtName'), 'The field "Name" is required', out.name);
        ValidateFields($('#txtEducation'), 'The field "Education" is required', out.education);
        ValidateFields($('#txtChartNumber'), 'The field "Chart Number" is required', out.chartNumber);
        ValidateFields($('#txtPhysican'), 'The field "Physician" is required', out.physican);
 
    }
    return false;
});

function ValidateFields(element, errorMessage, isHideError) {
    if (!isHideError) {
        $(element).closest('.input-icon').css({ 'border': '1px solid red' });
        if (!$(element).closest('.input-icon').next().hasClass('pError')) {
            $(element).closest('.input-icon').after('<p style="color:red;margin-top: 5px;" class="pError">' + errorMessage + '</p>');
        }
    }
    else {
        $(element).closest('.input-icon').css({ 'border': 'none' }).nextAll('.pError').remove();
    }
}


var DB = (function ($) {
    function dbase() {
        var dbShell, $that = this;
        var GetInsertQueries = function (insertedData) {
            log('GetInsertQueries');
            log(insertedData);
            var insertedQueries = [];
            $.each(insertedData.data, function (k, v) {
                var values = [];

                $.each(v, function (key, value) {
                    values.push("'" + value + "'");
                });

                var keys = $.map(v, function (item, i) {
                    return i;
                });

                var insertedQuery = "INSERT into " + insertedData.tableName + "(" + keys.join(',') + ")" + " values(" + values.join(',') + ")";
                insertedQueries.push(insertedQuery);
        
            });
            return insertedQueries;
        };
        var GetUpdateQueries = function (updateData) {
            var updatedQueries = [];
            $.each(updateData.data, function (k, v) {
                var keyValue = [];
                log(v);
                $.each(v, function (key, value) {
                    keyValue.push(key + "='" + value + "'");

                });
                var updatedQuery = "Update " + updateData.tableName + " SET " + keyValue.join(',') + updateData.Where;
                updatedQueries.push(updatedQuery);

            });
            return updatedQueries;
        };
        this.ResetTest = function (testId, testType, callback) {
            log('ResetTest');
            dbShell.transaction(function (tx) {
                tx.executeSql($that.DeleteImageQuery(testId, testType), [], function (tx, results) {
                    tx.executeSql($that.TestResultQuery(testId, testType), [], function (tx, results) {
                        if (results.rows.length > 0) {
                            var resultID = results.rows.item(0).resultID;
                            tx.executeSql($that.DeleteTestResultValuesQuery(resultID), [], function (tx, results) {
                                tx.executeSql($that.DeleteTestResultQuery(testId, testType), [], function (tx, results) {
                                    callback.apply(null, [true]);
                                });
                            });
                        }
                        else {
                            callback.apply(null, [true]);
                        }
                    });
                });

            });

        }
        this.AddTestResult = function (testResultData, callback) {

            dbShell.transaction(function (tx) {
                //delete
                var testId = testResultData.MocaTestResults.data[0].testID;

                var testType = testResultData.MocaTestResults.data[0].testTypeID;

                tx.executeSql($that.TestResultQuery(testId, testType), [], function (tx, results) {
                    var UpdateOrInsertQuery = "";
                    var resultID = 0;
                    if (results.rows.length > 0) {

                        resultID = results.rows.item(0).resultID;
                        var updateData = testResultData.MocaTestResults;
                        updateData.Where = " WHERE resultID=" + resultID;
                        UpdateOrInsertQuery = GetUpdateQueries(updateData)[0];
                    }
                    else {
                        UpdateOrInsertQuery = GetInsertQueries(testResultData.MocaTestResults)[0]
                    }
                    tx.executeSql(UpdateOrInsertQuery, [], function (tx, results) {

                        if (resultID == 0)
                            resultID = results.insertId;
                        log($that.DeleteTestResultValuesQuery(resultID));
                        tx.executeSql($that.DeleteTestResultValuesQuery(resultID), [], function (tx, results) {
                            $.each(testResultData.MocaTestResultsValues.data, function (k, v) {
                                v.resultID = resultID;
                            });
                            log(testResultData.MocaTestResultsValues);
                            var valuesQueries = GetInsertQueries(testResultData.MocaTestResultsValues);
                            log(valuesQueries);
                            $.each(valuesQueries, function (index, query) {
                                tx.executeSql(query, [], function (tx, results) {

                                });
                            });
                        });


                    });
                });

            }, this.dbErrorHandler, callback);

        };
        this.GetTestResult = function (testId, testType, callback) {
            var callbackFun = callback;
            $this = this;

            dbShell.transaction(function (tx, callback) {

                tx.executeSql($this.TestResultQuery(testId, testType), [], function (tx, results) {
                    if (results.rows.length > 0) {
                        var testResultData =
                        {
                            MocaTestResults: {
                                tableName: 'MocaTestResults',
                                data: []
                            },
                            MocaTestResultsValues: {
                                tableName: 'MocaTestResultsValues',
                                data: []
                            }
                        };
                        var testResult = results.rows.item(0);
                        var testResultID = testResult.resultID;
                        testResultData.MocaTestResults.data.push(
                            {
                                testID: testResult.testID,
                                testTypeID: testResult.testTypeID,
                                score: testResult.score,
                                timeTest: testResult.timeTest
                            });

                        tx.executeSql($this.TestResultValuesQuery(testResultID), [], function (tx, resultValues) {
                            log(resultValues.rows);
                            for (var i = 0; i < resultValues.rows.length; i++) {
                                var resultValue = resultValues.rows.item(i);
                                testResultData.MocaTestResultsValues.data.push(
                                    {
                                        valueResult: resultValue.valueResult,
                                        valueOptional: resultValue.valueOptional
                                    });
                            }

                            callbackFun.apply(null, [testResultData]);

                        });
                    }
                    else {
                        callbackFun.apply(null, [null]);
                    }


                });
            }, this.dbErrorHandler, this.getEntries);

        };

        this.GetClientInfo = function (testId, callback) {
            var callbackFun = callback;
            dbShell.transaction(function (tx, callback) {
                tx.executeSql($that.SelectClientByTestIdQuery(testId), [], function (tx, results) {
                    var Client = { "Client": results.rows.item(0) };
                    callbackFun.apply(null, [Client]);
                });
            });
        }


        this.GetMISTotal = function (testId, callback) {
            var callbackFun = callback;
            dbShell.transaction(function (tx, callback) {
                tx.executeSql($that.SelectMISQuery(testId), [], function (tx, results) {
                    var resultData = [];
                    var totalMisScore = 0;
                    for (var i = 0; i < results.rows.length; i++) {
                        var resultValue = results.rows.item(i);
                   
                        var coef=3;
                        if (resultValue.valueOptional > 5 &&resultValue.valueOptional <= 10 )
                            coef=2;
                        else if (resultValue.valueOptional >10)
                            coef=1;
                        if (resultValue.valueResult)
                        {
                            totalMisScore += coef;
                        }
                    }
                    callbackFun.apply(null, [totalMisScore]);
                });
            }, this.dbErrorHandler, this.getEntries);
        };


        this.GetTestResultByGroup = function (testId, groupId, callback) {
            var callbackFun = callback;
            dbShell.transaction(function (tx, callback) {
                tx.executeSql($that.SelectTestResultValuesByGroupIdAndTestIdQuery(testId, groupId), [], function (tx, results) {
                    var testResults = []; 

                    if (results.rows.length > 0) {
                        var groupName; var groupId;
                        for (var i = 0; i < results.rows.length; i++) {
                            var testResult = results.rows.item(i);
                             
                            testResult.testResultValues = [];
                            if (i == 0) {
                                groupName = testResult.GroupName;
                                groupId = testResult.GroupId;
                            }
                            testResults.push(testResult);
                        }

                       
                        var temp = testResults[0];
                       
                        temp.testResultValues.push({ valueOptional: temp.valueOptional, valueResult: temp.valueResult });



                        var resultArr = [temp];
                        count = 0;                        $.each(testResults, function (k, v) {
                            if (count > 0) {
                                var lastIndex = resultArr.length - 1;
                                if (resultArr[lastIndex].resultID !== v.resultID) {
                                    temp = v;
                                    temp.testResultValues.push({ valueOptional: temp.valueOptional, valueResult: temp.valueResult });
                                    resultArr.push(temp);
                                } else {
                                    resultArr[lastIndex].testResultValues.push({ valueOptional: v.valueOptional, valueResult: v.valueResult });
                                }
                            }
                            count++;

                        });
                        var res = { "groupName": groupName, "groupId": groupId, "testResult": resultArr };
                       
                        callbackFun.apply(null, [res]);
                    }
                });
            });
        }

        this.GetTestType = function () {
            var type=0;
            $.each(MocaTestTypes, function (k, v) {
                var ind = window.location.href.toLowerCase().indexOf(k.toLowerCase());
                if (ind !=-1) {
                    type = v;
                    return false;
                }
            });
            return type;
        }
        ///queries
        this.SelectTestResultValuesByGroupIdAndTestIdQuery = function (testId, groupId) {
            return "Select MocaTestResultsValues.valueResult, MocaTestResultsValues.valueOptional,  MocaTestResults.resultID, MocaTestGroup.Title as 'GroupName', MocaTestGroup.ID as 'GroupId', MocaTestResults.testID,MocaTestResults.testTypeID,MocaTestResults.score,MocaTestResults.timeTest From MocaTestResults inner join MocaTestType_MocaGroup On MocaTestResults.testTypeID = MocaTestType_MocaGroup.testTypeId inner join MocaTestGroup On MocaTestType_MocaGroup.GroupId =  MocaTestGroup.ID inner join MocaTestResultsValues on MocaTestResults.resultID= MocaTestResultsValues.resultID Where GroupId = " + groupId + " and MocaTestResults.testID=" + testId;
        };

        this.SelectClientByTestIdQuery = function (testID) {
            return "Select MocaTestClients.clientID, MocaTestClients.name, MocaTestClients.dateOfBirth, MocaTestClients.gender, MocaTestClients.education, MocaTestClients.chartNumber, MocaTestClients.physican From MocaTestClients Inner Join MocaTest ON MocaTestClients.clientID = MocaTest.clientID Where MocaTest.testID=" + testID;
        };

        this.TestResultValuesQuery = function (testResultID) {
            return "SELECT * FROM MocaTestResultsValues Where resultID=" + testResultID;
        };

        this.TestResultQuery = function (testId, testType) {
            return "SELECT * FROM MocaTestResults Where testID=" + testId + " AND testTypeID=" + testType;
        };

        this.DelayedRecallPreviousAnswersQuery = function (testId) {
            return "SELECT MocaTestResultsValues.valueOptional, MocaTestResultsValues.valueResult, MocaTestResults.testTypeID  FROM MocaTestResults Inner Join MocaTestResultsValues ON MocaTestResults.resultID= MocaTestResultsValues.resultID Where MocaTestResults.testID=" + testId + " AND (MocaTestResults.testTypeID=5 OR MocaTestResults.testTypeID=16)";
        };

        this.SelectMISQuery = function (testId) {
            return "SELECT MocaTestResultsValues.valueOptional, MocaTestResultsValues.valueResult, MocaTestResults.testTypeID  FROM MocaTestResults Inner Join MocaTestResultsValues ON MocaTestResults.resultID= MocaTestResultsValues.resultID Where MocaTestResults.testID=" + testId + " AND (MocaTestResults.testTypeID=5 OR MocaTestResults.testTypeID=16 OR MocaTestResults.testTypeID=17)";
        };

        this.SelectNamingInputWord = function()
        {
            return "SELECT  Distinct(substr(MocaTestResultsValues.valueOptional,3)) as 'word',  substr(MocaTestResultsValues.valueOptional,0,2) as 'wordNumber' FROM MocaTestResults Inner Join MocaTestResultsValues ON MocaTestResults.resultID= MocaTestResultsValues.resultID Where  MocaTestResults.testTypeID=9  And word <> ''";
        }

        this.SelectMISQuery = function (testId) {
            return "SELECT MocaTestResultsValues.valueOptional, MocaTestResultsValues.valueResult, MocaTestResults.testTypeID  FROM MocaTestResults Inner Join MocaTestResultsValues ON MocaTestResults.resultID= MocaTestResultsValues.resultID Where MocaTestResults.testID=" + testId + " AND (MocaTestResults.testTypeID=5 OR MocaTestResults.testTypeID=16 OR MocaTestResults.testTypeID=17)";
        };

        this.SelectImageQuery = function (testId, testType) {
            return "SELECT * FROM MocaImage Where testID=" + testId + " AND testTypeID=" + testType;
        };
        this.DeleteImageQuery = function (testId, testType) {
            return "Delete FROM MocaImage Where testID=" + testId + " AND testTypeID=" + testType;
        };

        this.DeleteCommentQuery = function (testId, testType) {
            return "Delete FROM MocaComments Where testID=" + testId + " AND testTypeID=" + testType;
        };
        this.DeleteTestResultValuesQuery = function (resultID) {
            return "Delete FROM MocaTestResultsValues Where resultID=" + resultID;
        };
        this.DeleteTestResultQuery = function (testId, testType) {
            return "Delete FROM MocaTestResults Where testID=" + testId + " AND testTypeID=" + testType;
        };


        ////////
        this.dbErrorHandler = function (err) { console.log("DB Error: " + err.message + "\nCode=" + err.code); return true };
        this.setupTable = function (callback) {
            dbShell.transaction(function (tx) {
                tx.executeSql("SELECT count(*) AS 'exist' FROM sqlite_master WHERE type='table' AND name='MocaTestClients'", [], function (tx, data) {
                    if (data.rows.item(0).exist) {
                        console.log('return');
                        return;
                    }
                    console.log('CREATE TABLE');
                    var tables = [
                          "CREATE TABLE IF NOT EXISTS MocaComments(commentID INTEGER PRIMARY KEY,section TEXT,comment TEXT,caneva TEXT,testID INTEGER,testTypeID INTEGER)",
                          "CREATE TABLE IF NOT EXISTS MocaTest(testID INTEGER PRIMARY KEY,testDate NUMERIC,clientID INTEGER,userID INTEGER,commentResult TEXT,imageResult TEXT)",
                          "CREATE TABLE IF NOT EXISTS MocaTestClients(clientID INTEGER PRIMARY KEY,name TEXT,dateOfBirth NUMERIC,gender INTEGER,education TEXT,chartNumber TEXT,physican TEXT)",
                          "CREATE TABLE IF NOT EXISTS MocaTestGroup(ID INTEGER PRIMARY KEY,Title TEXT)",
                          "CREATE TABLE IF NOT EXISTS MocaTestResults(resultID INTEGER PRIMARY KEY,testID INTEGER,testTypeID INTEGER,score INTEGER,timeTest NUMERIC,TbNote TEXT)",
                          "CREATE TABLE IF NOT EXISTS MocaTestResultsValues(resultValueID INTEGER PRIMARY KEY,resultID INTEGER,valueNumber INTEGER,valueResult INTEGER,valueOptional TEXT)",
                          "CREATE TABLE IF NOT EXISTS MocaTestType(testTypeID INTEGER PRIMARY KEY,testName TEXT,maxScore INTEGER,maxTime INTEGER)",
                          "CREATE TABLE IF NOT EXISTS MocaTestType_MocaGroup(GroupId INTEGER,TestTypeId INTEGER)",
                          "CREATE TABLE IF NOT EXISTS MocaTestUsers(userID INTEGER PRIMARY KEY,name TEXT,occupation TEXT,username TEXT,password TEXT)",
                          "CREATE TABLE IF NOT EXISTS MocaImage (ID INTEGER PRIMARY KEY, Data TEXT, testID INTEGER, testTypeID INTEGER)"
                    ];
                    $.each(tables, function (k, v) {
                        tx.executeSql(v);
                    });
                    ////////////////////
                    var insertedData = {
                        tableName: 'MocaTestType', data: [
                            { 'testName': "abstraction_01", 'maxScore': 2, 'maxTime': 10 },
                            { 'testName': "attention_01", 'maxScore': 1, 'maxTime': 10 },
                            { 'testName': "attention_02", 'maxScore': 1, 'maxTime': 20 },
                            { 'testName': "attention_03", 'maxScore': 3, 'maxTime': 5 },
                            { 'testName': "delayedrecall_01", 'maxScore': 15, 'maxTime': 15 },
                            { 'testName': "language_01", 'maxScore': 1, 'maxTime': 10 },
                            { 'testName': "language_02", 'maxScore': 1, 'maxTime': 10 },
                            { 'testName': "memory_01", 'maxScore': 5, 'maxTime': 20 },
                            { 'testName': "naming_01", 'maxScore': 3, 'maxTime': 20 },
                            { 'testName': "naming_02", 'maxScore': 5, 'maxTime': 15 },
                            { 'testName': "naming_03", 'maxScore': 0, 'maxTime': 15 },
                            { 'testName': "orientation_01", 'maxScore': 6, 'maxTime': 5 },
                            { 'testName': "visuospatial_01", 'maxScore': 1, 'maxTime': 30 },
                            { 'testName': "visuospatial_02", 'maxScore': 1, 'maxTime': 35 },
                            { 'testName': "visuospatial_03", 'maxScore': 3, 'maxTime': 30 },
                            { 'testName': "delayedrecall_02", 'maxScore': 0, 'maxTime': 3 },
                            { 'testName': "delayedrecall_03", 'maxScore': 0, 'maxTime': 5 },
                            { 'testName': "memory_02", 'maxScore': 0, 'maxTime': 20 },
                            { 'testName': "attention_01_b", 'maxScore': 1, 'maxTime': 15 },
                            { 'testName': "language_01_b", 'maxScore': 1, 'maxTime': 5 },
                        ]
                    };
                    var insertedQueries = GetInsertQueries(insertedData);
                    log("InsertDefaultTableTestType");
                    $.each(insertedQueries, function (k, v) {
                        tx.executeSql(v, [], function (tx, results) {
                            var result = results || null;
                        });
                    });
                    //////////////////////
                    insertedData = {
                        tableName: 'MocaTestGroup', data: [
                            { 'ID': 1, 'Title': "VISUOSPATIAL" },
                            { 'ID': 2, 'Title': "NAMING" },
                            { 'ID': 3, 'Title': "ATTENTION" },
                            { 'ID': 4, 'Title': "LANGUAGE" },
                            { 'ID': 5, 'Title': "ABSTRACTION" },
                            { 'ID': 6, 'Title': "DELAYED RECALL" },
                            { 'ID': 7, 'Title': "ORIENTATION" },
                            { 'ID': 8, 'Title': "MEMORY" }
                        ]
                    };
                    insertedQueries = GetInsertQueries(insertedData);
                    log("InsertDefaultTableGroup");
                    $.each(insertedQueries, function (k, v) {
                        tx.executeSql(v, [], function (tx, results) {
                            var result = results || null;
                        });
                    });
                    ////////////////////
                    insertedData = {
                        tableName: 'MocaTestType_MocaGroup', data: [
                            { 'GroupId': 1, 'TestTypeId': 13 },
                            { 'GroupId': 1, 'TestTypeId': 14 },
                            { 'GroupId': 1, 'TestTypeId': 15 },
                            { 'GroupId': 2, 'TestTypeId': 9 },
                            { 'GroupId': 3, 'TestTypeId': 2 },
                            { 'GroupId': 3, 'TestTypeId': 19 },
                            { 'GroupId': 3, 'TestTypeId': 3 },
                            { 'GroupId': 3, 'TestTypeId': 4 },
                            { 'GroupId': 4, 'TestTypeId': 6 },
                            { 'GroupId': 4, 'TestTypeId': 20 },
                            { 'GroupId': 4, 'TestTypeId': 7 },
                            { 'GroupId': 5, 'TestTypeId': 1 },
                            { 'GroupId': 6, 'TestTypeId': 5 },
                            { 'GroupId': 6, 'TestTypeId': 16 },
                            { 'GroupId': 6, 'TestTypeId': 17 },
                            { 'GroupId': 7, 'TestTypeId': 12 },
                            { 'GroupId': 8, 'TestTypeId': 8 },
                            { 'GroupId': 8, 'TestTypeId': 18 },
                        ]
                    };
                    insertedQueries = GetInsertQueries(insertedData);
                    log("InsertDefaultTableGroup");
                    $.each(insertedQueries, function (k, v) {
                        tx.executeSql(v, [], function (tx, results) {
                            var result = results || null;
                        });
                    });

                });
            }, this.dbErrorHandler, callback);

        };

        this.insertData = function (insertedData, callback) {
            dbShell.transaction(function (tx) {
                log('beginInsert');
                var insertedQueries = GetInsertQueries(insertedData);
               
                $.each(insertedQueries, function (k, v) {
                    tx.executeSql(v, [], function (tx, results) {
                        var result = results || null;
                        callback.apply(null, [result]);
                    });
                });
            },
            this.dbErrorHandler, this.getEntries);
        };

        this.updateData = function (updatedData, callback) {
            dbShell.transaction(function (tx) {
                log('beginUpdate');
                var updatedQueries = GetUpdateQueries(updatedData);
                log(updatedQueries);
                $.each(updatedQueries, function (k, v) {
                    tx.executeSql(v, [], function (tx, results) {
                        var result = results || null;
                        callback.apply(null, [result]);
                    });
                });
            },
            this.dbErrorHandler, this.getEntries);
        };

        this.selectData = function (query, callback) {
            dbShell.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, results) {
                    var result = results || null;
                    callback.apply(null, [result]);
                });
            },
            this.dbErrorHandler, this.getEntries);
        };
        this.deleteData = function (query, callback) {
            dbShell.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, results) {
                    var result = results || null;
                  
                    callback.apply(null, [result]);
                });
            },
            this.dbErrorHandler, this.getEntries);
        };
        this.Ready = function (err) {
            console.log("phoneReady");
            var maxSize = 5 * 1024 * 1024;
            dbShell = window.openDatabase("MoCA", 2, "MoCA", maxSize);
            console.log("db was opened");
        };
        document.addEventListener("deviceready", this.Ready.call(this), false);
    };
    var DB = new dbase();
    return DB;
})(jQuery || $);


function log(s) { console.log(s); };


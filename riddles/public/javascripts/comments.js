/*global $*/
/*global angular*/




var firstApp = angular.module('riddleApp', []);
firstApp.controller('RiddleController', function($scope, $http) {
    $scope.riddles = [];
    $scope.quantity = 1;
    $scope.orderVar = "-DateCreated";
    $scope.numRiddles;

    var results = new RegExp('[\?&]' + "sort" + '=([^&#]*)').exec(window.location.href);
    if (results != null) {
        if (results[1] == "newest") {
            $scope.orderVar = "-DateCreated";
        }
        else if (results[1] == "hardest") {
            $scope.orderVar = "Percentage";
        }
        else if (results[1] == "easiest") {
            $scope.orderVar = "-Percentage";
        }
    }

    $.ajax({
        url: 'riddles',
        type: 'GET',
        success: function(data) {
            $scope.riddles = data;
            for (var i = 0; i < $scope.riddles.length; i++) {
                if ($scope.riddles[i]['Correct'] != 0 || $scope.riddles[i]['Wrong'] != 0) {
                    $scope.riddles[i]['Percentage'] = Math.floor($scope.riddles[i]['Correct'] / ($scope.riddles[i]['Correct'] + $scope.riddles[i]['Wrong']) * 100);
                }
                else {
                    $scope.riddles[i]['Percentage'] = 0;
                }
            }
            console.log(data);
            $scope.numRiddles = $scope.riddles.length;
            $scope.$digest();
        }
    })

    $scope.addRiddle = function() {
        var d = new Date();
        var newriddle = { Riddle: $scope.formRiddle, Answer: $scope.formAnswer, DateCreated: d.getTime(), Correct: 0, Wrong: 0, UserAnswer: "", DisplayAnswer: 0 };
        $.ajax({
            url: 'riddles',
            type: 'POST',
            data: newriddle,
            success: function(data) {
                $scope.riddles.push(data);
                $scope.numRiddles = $scope.riddles.length;
                $scope.$digest();
            }
        });
        $scope.formRiddle = "";
        $scope.formAnswer = "";
    };

    $scope.addCorrect = function(riddle) {
        $.ajax({
            url: '/riddles/' + riddle._id + '/correct',
            type: 'PUT',
            success: function(data) {
                console.log("success");
                riddle.correct += 1;
                $scope.quantity += 1;
                $scope.$digest();
            }
        });
    };

    $scope.addWrong = function(riddle) {
        $.ajax({
            url: '/riddles/' + riddle._id + '/wrong',
            type: 'PUT',
            success: function(data) {
                console.log("success");
                riddle.wrong += 1;
                $scope.quantity += 1;
                $scope.$digest();
            }
        });
    };

    $scope.checkAnswer = function(riddle) {
        riddle.DisplayAnswer = 1;
        console.log(riddle);
        $scope.quantity += 1;
    };

    $scope.deleteRiddle = function(riddle) {
        $.ajax({
            url: 'riddles/' + riddle._id,
            type: 'DELETE',
            success: function(data) {
                console.log("riddle deleted");
                $scope.riddles = data;
                $scope.$digest();
            }
        });
    };

    $scope.skipRiddle = function(riddle) {
        $.ajax({
            url: '/riddles/' + riddle._id + '/skip',
            type: 'PUT',
            success: function(data) {
                console.log("success");
                riddle.wrong += .7;
                $scope.quantity += 1;
                $scope.$digest();
            }
        });
    }

    /*$scope.hardestFirst = function() {
        $scope.orderVar = "Percentage";
        $scope.quantity = 1;
        $scope.$digest();
        $scope.showAnswers = false;
    };

    $scope.easiestFirst = function() {
        $scope.orderVar = "-Percentage";
        $scope.quantity = 1;
        $scope.$digest();
    };

    $scope.newestFirst = function() {
        $scope.orderVar = "-DateCreated";
        $scope.quantity = 1;
        $scope.$digest();
    };
    */

});

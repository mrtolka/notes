/**
 * Created by dsk6 on 29.10.2015.
 */

module.controller("UserFormController", function($scope, $http, $location) {
    $scope.user = {};

    $scope.submitForm = function() {
        $http.post("/users", $scope.user).success(function (data) {
            console.log("User saved");
            $location.path("/");
        });
    }
});

module.directive("matchTo", function() {
    return {
        require: "ngModel",
        scope: {otherValue: "=matchTo"},
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.matchTo = function(modelValue) {
                return modelValue == scope.otherValue;
            };

            scope.$watch("otherValue", function() {
                ngModel.$validate();
            });
        }
    };
});

//module.directive('uniqueUser', function($http, $q) {
//    var timer;
//    return {
//        restrict: 'A',
//        require: 'ngModel',
//        link: function(scope, elem, attr, ngModel) {
//            ngModel.$asyncValidators.unique = function(modelValue, viewValue) {
//                var value = modelValue || viewValue;
//
//                return $http.get('/checkUser?user=' + value).
//                    then(function(response) {
//                        if (!response.data) {
//                            return $q.reject();
//                        }
//                        return true;
//                    });
//            };
//        }
//    }
//});

module.directive('uniqueUser', function($http, $timeout) {
    var timer;
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            //when the scope changes, check the email.
            scope.$watch(attr.ngModel, function(value) {
                // if there was a previous attempt, stop it.
                if (timer) $timeout.cancel(timer);

                // start a new attempt with a delay to keep it from
                // getting too "chatty".
                timer = $timeout(function(){
                    // call to some API that returns { isValid: true } or { isValid: false }
                    $http.get('/checkUser?user=' + value).success(function(result) {
                        console.log("result is ", result);
                        //set the validity of the field
                        ctrl.$setValidity('unique', result);
                    });
                }, 200);
            })
        }
    }
});
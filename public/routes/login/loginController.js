/**
 * Created by dsk6 on 30.10.2015.
 */

module.controller("LoginController", function($scope, $timeout, $location, $route, UserService) {

    $scope.loggedIn = UserService.loggedIn;

    $scope.logout = function() {
        UserService.logout().then(function() {
            $scope.loggedIn = false;
            $location.path("/");
            $route.reload();
        });
    }

    $scope.login = function() {
        UserService.login($scope.username, $scope.password)
            .then(
            function(res) {
                $scope.loggedIn = true;
                $location.path("/");
                $route.reload();
            },
            function(res) {
                $scope.wrongPassword = true;
                $timeout(function() {
                    $scope.wrongPassword = false;
                }, 1000);
            }
        );
    }

});


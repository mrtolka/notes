/**
 * Created by dsk6 on 27.10.2015.
 */

var module = angular.module('myapp', []);

module.controller('NotesController',
    function ($scope,$http) {

        $scope.notes = [];
        $scope.add = function() {
            var note = {text: $scope.text};
            $http.post("/notes", note).success(function() {
                $scope.text = '';
                update();
            });
        };

        $scope.remove = function() {
          $http.delete("/notes", {params: {id:$scope.noteId}}).success(function() {
              update();
          });

        };

        var update = function() {
            $http.get("/notes").success(function(notes) {
                $scope.notes = notes;
            });
        };

        update();


});



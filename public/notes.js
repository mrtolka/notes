/**
 * Created by dsk6 on 27.10.2015.
 */

var module = angular.module('myapp', []);

module.controller('NotesController',
    function ($scope,$http) {

        $scope.notes = [];

        var update = function() {
            var params = {params: {section:$scope.activeSection}};
            $http.get("/notes", params).success(function(notes) {
                $scope.notes = notes;
                console.log('Notes: ');
                console.log($scope.notes);
            });
        };


        $scope.add = function() {
            var note = {text: $scope.text};
            $http.post("/notes", note).success(function() {
                $scope.text = '';
                update();
            });
        };

        $scope.remove = function(id) {
          $http.delete("/notes", {params: {id:id}}).success(function() {
              update();
          });
        };

        $scope.showSection = function(section) {
            $scope.activeSection = section.title;
            update();
        };

        //*********************** TO FINISH **********************************
        //$scope.writeSections = function() {
        //    if ($scope.sections && $scope.sections.length > 0) {
        //        $http.post("/sections/replace", $scope.sections);
        //    }
        //};

        $scope.addSection = function() {
            if ($scope.newSection.length == 0) return;

            for (var i=0; i<$scope.length; i++) {
                if ($scope.sections[i].title==$scope.newSection) {return;}
            }

            var section = {title: $}

        }

        var readSections = function() {
            $http.get("/sections").success(function(sections) {
                $scope.sections = sections;

                if ($scope.sections.length > 0) {
                    $scope.activeSection = $scope.sections[0].title;
                }

                console.log('Sections: ');
                console.log($scope.sections);
                update();
                });
        };

        readSections();



        //update();
});



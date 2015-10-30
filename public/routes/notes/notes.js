module.controller('NotesController', function($scope, $http, $routeParams, $location, Note) {

	var update = function() {
		$scope.notes = Note.query({section:$scope.activeSection});
	};
	
	$scope.activeSection = $routeParams.section;
	
	var readSections = function() {
		$http.get("/sections")
		.success(function(sections) {
			$scope.sections = sections;
			if (!$scope.activeSection && $scope.sections.length>0) {
				$scope.activeSection = $scope.sections[0].title;
			}
			update();
		});
	};
	
	$scope.update = update;

	//$scope.add = function() {
	//	if ($scope.text.length==0) return;
	//	var note = {text: $scope.text};
	//	note.section = $scope.activeSection;
	//	$http.post("/notes", note).success(function() {
	//			$scope.text = "";
	//			update();
	//		});
	//};


	$scope.add = function() {
		if ($scope.text.length==0) return;
		var note = new Note();
		note.text = $scope.text;
		note.section = $scope.activeSection;
		note.$save(function() {
			$scope.text = "";
			update();
		});
	};

	readSections();
	
	$scope.showSection = function(section) {
		$scope.activeSection = section.title;
		$location.path(section.title);
		update();
	};
	
	$scope.addSection = function() {
		if ($scope.newSection.length==0) return;
		// check for duplicates
		for (var i=0;i<$scope.sections.length;i++) {
			if ($scope.sections[i].title==$scope.newSection) {
				return;
			}
		}
		
		var section = {title: $scope.newSection};
		$scope.sections.unshift(section);
		$scope.activeSection = $scope.newSection;
		$scope.newSection = "";
		$scope.writeSections();
		update();
	};
	
    $scope.writeSections = function() {
        // replace sections after dragging to reflect the new order
    		if ($scope.sections && $scope.sections.length>0) {
    			$http.post("/sections/replace", $scope.sections);
    		}
    };
});

module.factory('Note', function($resource) {
	return $resource('/notes');
});
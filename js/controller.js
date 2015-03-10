'use strict';
//create a module to oranize controllers
var controllersModule = angular.module("ttmatchApp.Controllers", [])
/* Controllers */

controllersModule.controller('HeaderController', function($scope) {
    /* Controller Stuff */
});

/* Controller for the filters in the sidebar */
controllersModule.controller('sidebarController', function($scope, ageService, timeService) {
    // number of players filter
    $scope.numberOfPlayers = 2; // default players
    $scope.increasePlayers = function() {
      $scope.numberOfPlayers++;
      console.log("I'm in increasePlayers");
    }
    $scope.decreasePlayers = function() {
      if ($scope.numberOfPlayers > 1) {
        $scope.numberOfPlayers--; // decrease until 1
      } else {
        $scope.numberOfPlayers = 1; // 1 is the minimum player number
      }
    }


    // minimum age filter
    $scope.ageLimit = {
        min: 2,
        max: 18,
        userMin: 16,
        userMax: 18
    };

    $scope.ageInclude = ageService.get();
    $scope.includeAge = function(minAge) {
        $scope.ageInclude = ageService.get();
        $scope.ageInclude = minAge;
        ageService.set($scope.ageInclude);
        //console.log("this is minAge in includeAge() " + minAge);
        //console.log("$scope.ageInclude in includeAge() " + $scope.ageInclude);
    }


    // time to play filter
    $scope.timeLimit = {
        min: 10,
        max: 360,
        userMin: 20,
        userMax: 120,
    };
    $scope.timeFilter = timeService.get();
    $scope.includeTime = function(timeMin, timeMax) {
        $scope.timeFilter = timeService.get();
        $scope.timeFilter.min = timeMin;
        $scope.timeFilter.max = timeMax;
        timeService.set($scope.timeFilter.min, $scope.timeFilter.max);
    }
});

controllersModule.controller('ContentController', function($scope, $http, $location, gamesService, filterService, ageService, timeService) {
    //checks if the games.json has ever been accessed before.
    //this is done so that the json is not included every time 
    $scope.filterText = filterService.get();
    if (!gamesService.isInitialized()) {
    //if it hasn't been included before, an ajax call is made 
    //towards the file that is contained in the same folder as index.html
    $http.get("js/games.json").success(function(data) {
        //the questionaire variable is set with the data gotten from the call
        // gamesService.set(data);
        console.log(data);
        $scope.games = data;
        console.log($scope.games);
    }).
    error(function() { //if an error occured, the console shows that the json wasn't included
        console.log("json not included");
    });
    }
    //if a game is pressed, it routs it to the game view
    $scope.show = function(gameID){
        console.log(gameID);
        $location.path(':'+ gameID);
    }
    $scope.tagFilter = function(game) {
        var shouldShow = false;
        if ($scope.filterText.length > 0) {
            for(var k=0; k<game.attributes.length; k++){    
                if ($.inArray(game.attributes[k].name, $scope.filterText) >= 0){
                    shouldShow = true;
                    //return;
                }
            }
            if(shouldShow){
                return game;
            }else{
                return;
            }
        }
            return game;
    }

    // filter games based on the minimum age
    $scope.ageFiltering = function (game) {
        $scope.ageFilter = ageService.get(); // get default age from service
        // console.log("game in ageFiltering() " + game);
        // console.log("game.min_age in ageFiltering() " + game.min_age);
        // console.log("scope.ageFilter in ageFiltering()" + $scope.ageFilter);
        if (game.min_age >= $scope.ageFilter) { // if the game's minimum age fits the criteria
            //console.log("true game.min_age");
            return game;
        } else {
            //console.log("false");
            return; // no game returned
        }
        return game;
    }

    // filter games based on the duration
    $scope.timeFiltering = function (game) {
        $scope.timeInclude = timeService.get(); // get min time to play
        console.log("$scope.timeInclude in timeFiltering "+ $scope.timeInclude);
        if (game.duration >= $scope.timeInclude.min && game.duration <= $scope.timeInclude.max) { // if game fits criteria
            return game;
        } else {
            return; // no game returned
        }
        return game;
    }
});

controllersModule.controller("GameController", function($scope, $http, $stateParams, gamesService) {
    //gets rid of the : character
    var $id =  $stateParams.id;

    
    //checks if the games.json has ever been accessed before.
    //this is done so that the json is not included every time the question is changed
    if (!gamesService.isInitialized()) {
        //if it hasn't been included before, an ajax call is made 
        //towards the file that is contained in the same folder as index.html
        $http.get("js/games.json").success(function(data) {
            //the questionaire variable is set with the data gotten from the call
            gamesService.set(data);
            //if in the path there is an array that stands as a attrID (the question name)
            $scope.game = gamesService.get($id);
        }).
        error(function() { //if an error occured, the console shows that the json wasn't included
            console.log("json not included");
        });
    }
    // in case the games has already been included, and there is an gameID in the route
    if ($id && gamesService.isInitialized()) {
        //the current scope gets the array that is associated with that particular question
        $scope.game = gamesService.get($id);
    }
    $scope.rate = 7;
    $scope.max = 10;
    $scope.isReadonly = false;
    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };
   
});

controllersModule.controller('filterController', function($scope, filterService){
	$scope.filterLimit = tagsToShow;
  	$scope.filter = game_tags;
  	$scope.tagsInclude = filterService.get();

    
    $scope.includeTag = function(tag) {
    	$scope.tagsInclude = filterService.get();
        var i = $.inArray(tag, $scope.tagsInclude);
        if (i > -1) {
            $scope.tagsInclude.splice(i, 1);
        } else {
            $scope.tagsInclude.push(tag);
        }
        filterService.set($scope.tagsInclude);
    }
});

controllersModule.controller('gameController', function($scope, $http, $routeParams, gamesService) {
    //gets rid of the : character
    var $id = $routeParams.gameId.substring(1);

    
    //checks if the games.json has ever been accessed before.
    //this is done so that the json is not included every time the question is changed
    if (!gamesService.isInitialized()) {
        //if it hasn't been included before, an ajax call is made 
        //towards the file that is contained in the same folder as index.html
        $http.get("js/games.json").success(function(data) {
            //the questionaire variable is set with the data gotten from the call
            gamesService.set(data);
            //if in the path there is an array that stands as a attrID (the question name)
            if ($routeParams.gameId) {
                //the current scope gets the array that is associated with that particular question
                $scope.game = gamesService.get($id);
            }
        }).
        error(function() { //if an error occured, the console shows that the json wasn't included
            console.log("json not included");
        });
    }
    // in case the games has already been included, and there is an gameID in the route
    if ($id && gamesService.isInitialized()) {
        //the current scope gets the array that is associated with that particular question
        $scope.game = gamesService.get($id);
    }
    $scope.rate = 7;
    $scope.max = 10;
    $scope.isReadonly = false;
    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };
   
});
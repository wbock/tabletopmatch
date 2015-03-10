'use strict';

/*main module definition*/
var ttmatch = angular.module("ttmatchApp", ["ui.router", "ngTouch", "ui-rangeSlider",
    "ttmatchApp.Controllers",  "ttmatchApp.Services", "ttmatchApp.Directives", "ttmatchApp.Filters", "ui.bootstrap"]);

ttmatch.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state("home",{
            url: "/",
            views: {
                "header": {
                    templateUrl: "partials/header.html",
                    controller: "HeaderController"
                },
                "sidebar": {
                    templateUrl: "partials/sidebarFilter.html"
                },
                "content": {
                    templateUrl: "partials/content.html",
                    controller: "ContentController"
                }

            }
        })
        .state('home.detail', {
            url: 'detail/:id',
            views: {
                'content@': {
                    templateUrl: "partials/gameDetails.html",
                    controller: "GameController"
                },
                'sidebar@': {
                    templateUrl: "partials/sidebarLibrary.html",
                    
                }
            }
        });
}]);
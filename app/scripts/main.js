(function () {

  'use strict';

  var typewriteDirective = require('./directives/imjellyd-typewrite'); // We can use our WelcomeCtrl.js as a module. Rainbows.

  angular.module('imjellydApp', ['ngRoute', 'ngAnimate'])
  .config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');
      // routes
      $routeProvider
        .when("/", {
          templateUrl: "./dist/views/partial1.html",
          controller: "MainController"
        })
        .otherwise({
           redirectTo: '/'
        });
    }
  ])

  //Load controller
  .controller('MainController', function($scope) {
      $scope.test = "Testing...";
  })

  .directive('typewrite',['$timeout', typewriteDirective]);

}());
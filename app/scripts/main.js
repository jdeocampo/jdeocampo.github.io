(function () {

  'use strict';

  var typewriteDirective = require('./directives/imjellyd-typewrite'); // We can use our WelcomeCtrl.js as a module. Rainbows.

  // $('.portfolio-container-more').hide();
  // $('.portfolio .def-btn').click(function() {
  //   $('.portfolio-container-more').show();
  //   $('.show-more').hide();
  // });
  angular.module('imjellydApp', ['ngRoute', 'ngAnimate', 'ngDialog'])
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

  .factory('imjellydService', function($http, $q) {
    var deffered = $q.defer();
    var data = [];  
    var imjellydService = {};

    imjellydService.async = function() {
      $http.get('imjellyd.json')
      .success(function (d) {
        data = d;
        deffered.resolve();
      });
      return deffered.promise;
    };
    imjellydService.data = function() { return data; };

    return imjellydService;
  })
  //Load controller
  .controller('MainController', function($scope, ngDialog, imjellydService ) {
    $scope.portfolioLimit = 6;
    imjellydService.async().then(function() {
      $scope.data = imjellydService.data();
    });
    $scope.clickToOpen = function (index) {
      $scope.portfolio = $scope.data.portfolio[index];
      ngDialog.open({
        template: "dist/views/modal.html",
        scope: $scope
      });
    };
  })

  .directive('typewrite',['$timeout', typewriteDirective]);

}());
(function () {

  'use strict';

  var typewriteDirective = require('./directives/imjellyd-typewrite'); // We can use our WelcomeCtrl.js as a module. Rainbows.

  function scrollToAnchor(aid){
    var aTag = $(aid);
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
  }

  $('.nav a, .scroll-info a, #acontact').click(function(e) {
    e.preventDefault();
    scrollToAnchor($(this).attr("href"));
  });

  new WOW().init();

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
  .controller('MainController', function($scope, $http, ngDialog, imjellydService ) {
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

    $scope.sendContactUs = function() {
      $http({
        url: "http://formspree.io/me@imjellyd.com",
        data: $.param({
            _replyto: $scope.email,
            _subject: "Email inquiry from " + $scope.subject,
            _cc: 'jellydeocampo@icloud.com',
            message: $scope.message
        }),
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function() {
         ngDialog.open({
        template: "dist/views/thankyou.html",
        preCloseCallback: function(){ 
          $scope.message = "";
          $scope.email = "";
          $scope.subject = "";
        }
      });
      });
    };
  })

  .directive('typewrite',['$timeout', typewriteDirective]);

}());
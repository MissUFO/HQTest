
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function ($ionicPlatform, $ionicPopup, questionService, popupService) {
    $ionicPlatform.ready(function () {

        //preload
        questionService.getData();
        popupService.getData();

    });
})

.config([
  '$compileProvider',
  function ($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);
  }
])

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })

    .state('app.about', {
        url: "/about",
        views: {
            'menuContent': {
                templateUrl: "templates/about.html",
                controller: 'AboutCtrl'
            }
        }
    })

    .state('app.start', {
        url: "/start",
        views: {
            'menuContent': {
                templateUrl: "templates/start.html",
                controller: 'StartCtrl'
            }
        }
    })
      .state('app.question', {
          url: "/question/:qId",
          views: {
              'menuContent': {
                  templateUrl: "templates/question.html",
                  controller: 'QuestionCtrl'
              }
          }
      })

    .state('app.finish', {
        url: "/finish/:fId",
        views: {
            'menuContent': {
                templateUrl: "templates/finish.html",
                controller: 'FinishCtrl'
            }
        }
    })

    .state('app.send-message', {
        url: "/send-message",
        views: {
            'menuContent': {
                templateUrl: "templates/send-message.html",
                controller: 'SendMessageCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise('/app/about');
    //$urlRouterProvider.otherwise('/app/finish/0');
})

.factory('questionService', function ($http) {

    var questions;

    return {
        getData: function () {

            return $http.get(SOURCE_URL + SOURCE_FILE).success(function (response) {

                questions = response.questions;

                window.localStorage.setItem(DATE_KEY, JSON.stringify(questions));
                window.localStorage.setItem(CONFIG_KEY, JSON.stringify(response.config));

                return questions;

            }).error(function (e) {

                if (window.localStorage.getItem(DATE_KEY) != undefined) {
                    questions = JSON.parse(window.localStorage.getItem(DATE_KEY));
                }

                return questions;
            });
        }
    }
})
.factory('popupService', function ($http, $q) {

    var popup_data;

    return {
        getData: function () {

            if (window.localStorage.getItem(POPUP_KEY) != undefined) {

                popup_data = JSON.parse(window.localStorage.getItem(POPUP_KEY));
                return popup_data;

            } else {

                return $http.get(POPUP_URL + POPUP_FILE).success(function (response) {

                    popup_data = response.popup;
                    window.localStorage.setItem(POPUP_KEY, JSON.stringify(popup_data));
                    return popup_data;

                }).error(function (e) {                  
                    return popup_data;
                });
            }
        },
        findById: function (id) {

            var deferred = $q.defer();

            if (window.localStorage.getItem(POPUP_KEY) != undefined) {
                popup_data = JSON.parse(window.localStorage.getItem(POPUP_KEY));
            } else {
                popup_data = this.getData();
            }

            var results = popup_data.filter(function (element) {
                var elementId = element.id;
                return elementId == id;
            });

            deferred.resolve(results);
            return deferred.promise;
        }
    }
});



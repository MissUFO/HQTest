
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function ($ionicPlatform, $ionicPopup, $http, questionService) {
    $ionicPlatform.ready(function () {

        
        var wsUrl = "http://pilotlight.net/svc/Utils.svc";
        var action = "http://tempuri.org/iUtils/sendMail";
        var soapRequest = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><sendMail xmlns="http://tempuri.org/"><sSvcName>HQTEST</sSvcName><sCode>$erv1cePwd</sCode><sToAddress>smetaninatv@yandex.ru</sToAddress><sSubject>New</sSubject><sMessage>test</sMessage></sendMail></s:Body></s:Envelope>';
        
        var oXMLHttpRequest = new XMLHttpRequest;
        oXMLHttpRequest.open("POST", wsUrl, false);
        oXMLHttpRequest.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE) {
                // my code
            }
        }
       

        //preload
        questionService.getData();

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
});



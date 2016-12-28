angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope) {
   
})

.controller('AboutCtrl', function ($scope, $state) {

    $scope.btnClick = function () {

        $state.go('app.start');

    };

    $scope.btnShare = function () {

        if (window.plugins.socialsharing != undefined) {
            window.plugins.socialsharing.share(
              SOCIAL_MSG,
              SOCIAL_SUB,
              SOCIAL_IMG,
              SOCIAL_URL);
        }

    };
})

.controller('StartCtrl', function ($scope, $state) {

    $scope.btnClick = function () {

        $state.go('app.question', { qId: 0 });

    };
})

.controller('QuestionCtrl', function ($scope, $state, $ionicLoading, $timeout, $stateParams, questionService) {

    $scope.allquestions = [];
    $scope.currentquestion = [];
    $scope.index = 0;

    $scope.selectedAnswer = -1;

    if($stateParams.qId!=undefined)
    {
        $scope.index = $stateParams.qId;
    }

    if (window.localStorage.getItem(DATE_KEY) != undefined){
        $scope.allquestions = JSON.parse(window.localStorage.getItem(DATE_KEY));
    }else
    {
        questionService.getData().then(function (q) {
            $scope.allquestions = q.data.questions;
        });
    }
    
    if ($scope.allquestions != undefined && $scope.allquestions.length>0)
    {       
        $scope.currentquestion = $scope.allquestions[$scope.index];
    }

    $scope.answerClicked = function (i) {
        $scope.selectedAnswer = i;

        var el = document.getElementsByName("rb" + $scope.index);        
        if (el != undefined && el.length > 0) {
            for (var j = 0; j < el.length; j++) {
                if (i==j) {
                    el[j].checked = true;
                    break;
                }
            }
        }
    };

    $scope.btnClick = function () {

        var el = document.getElementsByName("rb" + $scope.index);
        var isvalid = false;
        if (el != undefined && el.length > 0)
        {
            for (var i = 0; i < el.length; i++) {
                if(el[i].checked)
                {
                    isvalid = true;
                    break;
                }
            }
        }

        if (isvalid) {

            $scope.index = Number($scope.index) + 1;
            if ($scope.index < $scope.allquestions.length)
                $state.go('app.question', { qId: $scope.index });
            else {

                $ionicLoading.show({
                    template: '<i class="icon ion-loading-c"></i>  Calculating your score...', noBackdrop: true, duration: 4000
                });

                $timeout(function () {
                    $state.go('app.finish', { fId: 0 });
                }, 4000);
            }           

        }

    };

})
.controller('FinishCtrl', function ($scope, $state, $stateParams, $ionicPopup, popupService) {

    $scope.isfirst = ($stateParams.fId == 0);
    $scope.issecond = ($stateParams.fId == 1);
    $scope.isthird= ($stateParams.fId == 2);

    if ($scope.isfirst)
    {
        try {
            var soapRequest =
                '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><sendMail xmlns="http://tempuri.org/">' +
                '<sSvcName>HQTEST</sSvcName>' +
                '<sCode>$erv1cePwd</sCode>' +
                '<sToAddress>' + MAIL_TO + '</sToAddress>' +
                '<sSubject>' + MAIL_SUBJ_FINISH + '</sSubject>' +
                '<sMessage>' + MAIL_SUBJ_FINISH + '</sMessage>' +
                '</sendMail></s:Body></s:Envelope>';

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST', MAIL_wsUrl, true);

            xmlhttp.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
            xmlhttp.setRequestHeader('SOAPAction', MAIL_wsAction);

            xmlhttp.send('<?xml version="1.0" encoding="utf-8" ?>' + soapRequest);
        } catch (e) { }
    }

    $scope.showPopup = function (mId) {
                
        popupService.findById(mId).then(function (q) {

            if (q != undefined && q.length > 0) {
                var popup_data = q[0];

                var popup = $ionicPopup.show({
                    cssClass: 'myPopup',
                    scope: $scope,
                    template: popup_data.desc,
                    title:
                        '<div class="close-header" ><div class="close-text">CLOSE WINDOW</div> <span class="close-btn"><img src="images/close-icon.png" class="close-img"></span></div>' +
                        '<div>' +
                            popup_data.title +
                        '</div>',
                    backdropClickToClose: true
                });

                document.getElementById("hqtestapp").addEventListener('click', function (e)
                {
                    e = e || window.event;
                    var target = e.target || e.srcElement;
                    if (target.className.match('close-header') || target.className.match('close-text') || target.className.match('close-btn') || target.className.match('close-img') || target.className.match('backdrop')) {
                        popup.close();
                    }                   

                }, false);
               
            }

        });
       
    };
    

    $scope.btnNext = function () {

        $state.go('app.finish', { fId: (Number($stateParams.fId)+1) });

    };
    $scope.btnDone = function () {

        $state.go('app.about');

    };

    $scope.btnFinish = function () {

        $state.go('app.send-message');

    };
})
.controller('SendMessageCtrl', function ($scope, $http, $ionicLoading, $timeout, $state) {
        
    $scope.btnClick = function () {
        
        var body = document.getElementById("msg").value;
        var namefrom = document.getElementById("namefrom").value;
        var mailfrom = document.getElementById("mailfrom").value;
        if (body == "" && namefrom == "" && mailfrom == "")
        {
            $ionicLoading.show({
                template: 'Please, complete this form!', noBackdrop: true, duration: 1000
            });

            return;
        }

        try {
            var soapRequest =
                '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><sendMail xmlns="http://tempuri.org/">' +
                '<sSvcName>HQTEST</sSvcName>' +
                '<sCode>$erv1cePwd</sCode>' +
                '<sToAddress>' + MAIL_TO + '</sToAddress>' +
                '<sSubject>' + MAIL_SUBJ_NEW + '</sSubject>' +
                '<sMessage>Name: ' + namefrom + '&lt;br&gt;' +
                'Email: ' + mailfrom + '&lt;br&gt;' +
                'Message: ' + body + '</sMessage>' +
                '</sendMail></s:Body></s:Envelope>';

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST', MAIL_wsUrl, true);

            xmlhttp.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
            xmlhttp.setRequestHeader('SOAPAction', MAIL_wsAction);

            xmlhttp.send('<?xml version="1.0" encoding="utf-8" ?>' + soapRequest);
            xmlhttp.onreadystatechange = function () {

                if (!xmlhttp.status || xmlhttp.status == 200) {
                    $ionicLoading.show({
                        template: 'Your message has been sent!', noBackdrop: true, duration: 1000
                    });

                } else {
                    $ionicLoading.show({
                        template: 'Your message has not been sent!', noBackdrop: true, duration: 1000
                    });
                }

                $timeout(function () {
                    $state.go('app.about');
                }, 1000);
            };
        } catch (e) {
            $state.go('app.about');
        }
    };
});


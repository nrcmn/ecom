'use strict';

angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations',
    'ngWebSocket'
])

    .config(['$urlRouterProvider', '$locationProvider', function ($urlProvider, $locationProvider) {
        $urlProvider.otherwise('/');

        $locationProvider.html5Mode({
          enabled:false,
          requireBase: false
        });

        $locationProvider.hashPrefix('!');
    }])

    .run(function () {
        FastClick.attach(document.body);
    })

    .controller('MainCtrl', function ($websocket, $scope) {

        var dataStream = $websocket('ws://localhost:5000/status');
        dataStream.onMessage(function(message) {
            var data = JSON.parse(message.data);
            console.log(data);

            if (data.shopsList != undefined) {
                console.log(data.shopsList);
            }
        });
    })

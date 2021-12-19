var app = angular.module('dash',[]);

app.controller('dashcon', function($scope, $http)
{
  $http.get('/upf').then(function(data){
    $scope.file = data.data;
  });

  $http.get('/dashboard').then(function(data){
    $scope.dash = data.data;
  })
  $http.get('/dashboardtotal').then(function(data){
    $scope.counttotal = data.data;
  })
  $http.get('/dashboardparticular').then(function(data){
    $scope.countparticular = data.data;
  })
  $http.get('/eventtable').then(function(data){
    $scope.events = data.data;
  })

  $http.get('/update').then(function(data){
    $scope.up = data.data;
  })
});
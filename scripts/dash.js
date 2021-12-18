var app = angular.module('dash',[]);

app.controller('dashcon', function($scope, $http)
{
  $http.get('/upf').then(function(data){
    $scope.file = data.data;
  });
});
var app = angular.module('ToastAI', []);

app.controller('MainCtrl', [
'$scope',
function($scope){
  $scope.test = 'Hello world!';
  $scope.togglePasswordShow = function (){
  	$scope.passwordShowing = !$scope.passwordShowing
  }
}]);

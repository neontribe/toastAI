var app = angular.module('ToastAI', []);

app
.controller('MainCtrl', [
'$scope', 'User', 'Toast', '$location',
function($scope, User, Toast, $location){
  $scope.test = 'Hello world!';
  $scope.togglePasswordShow = function (){
  	$scope.passwordShowing = !$scope.passwordShowing
  }
  $scope.startToasting = function() {
  	$('.ui.basic.modal')
		  .modal('show')
		;
  }
  $scope.startTimer = function(minutes) {
  	// $('#clock').countdown('2016/08/03 15:16:56')

 		// .on('countdown.finish', function(event) {
 		// }
 		$scope.startToasting()
 		$scope.hourGlassStatus = 0
 		var now = new Date
 		var minutesFromNow = addMinutes(now, minutes)
  		console.log(minutesFromNow)
  		 var started = false
  		 var startSeconds
  		 	
  		$("#clock")
	       .countdown(minutesFromNow, function(event) {
	         $(this).text(
	           event.strftime('%M:%S remaining')
	         );
	         // var secondsRemaining=event.strftime("%S")
	         // var minutesRemaining=event.strftime("%M")
	         // var totalRemaining=minutesRemaining*60+secondsRemaining



	     }).on('finish.countdown', function(event) {
		  $(this).html('Your toast is ready!')
		  window.location.replace("/rate#?toastiness=" + minutes + "&user=" + $location.search().user);
		  

		});

	  }

	  // Users
	  $scope.users = []
	  $scope.createUser = function() {
	  	User.create($scope.user).then(function(response) {
	  		$scope.users[response.data.name] = response.config.data
	  	})
	  }
	  $scope.getUsers = function() {
	  	User.getAll().then(function(response) {
	  		$scope.users = response.data
	  	})
	  }
	  $scope.getUser = function() {
	  	var key = $location.search()
	  	console.log(key.user)
	  	User.get(key.user).then(function(response) {

	  		$scope.currentUser = response.data
	  	})
	  }
	  $scope.getUser()
	  $scope.getUsers()


	  //Toasts
	  $scope.toast = {}
	  $scope.sendToast = function(minutes) {
	  	$scope.startTimer(minutes)

	  }
	  $scope.createToast = function() {
	  	$scope.toast.toastiness = $location.search().toastiness
	  	$scope.toast["user_id"] =  $location.search().user
	  	console.log($scope.toast)
	  	Toast.create($scope.toast).then(function() {
	  		window.location.replace("/toast/view#?user_id=" + $scope.toast["user_id"])
	  	})

	  	
	  }
	  $scope.rateLevels = ["undercooked", "just perfect", "overcooked"]

	  $scope.getAllToasts = function() {
	  	Toast.getAll().then(function(response) {
	  		$scope.toasts = response.data
	  		
	  	})
	  }

	  $scope.getToastLevel = function(seconds) {
	  	return parseInt(seconds / 30)
	  }
	  $scope.deleteToast = function(key) {
	  	Toast.delete(key).then(function() {
	  		delete $scope.toasts[key]
	  	})
	  }



  function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
	}
}])
.factory('Toast', ['$http', function($http) {
   return {
        create: function(toast) {
            return $http.post('https://toastai-1950f.firebaseio.com/toasts.json',
            	{ 
            		 "toastiness": toast.toastiness * 60,
            		 "createdAt": new Date(),
            		 "user_id": toast["user_id"],
            		 "rating": toast.rating
                });
        },
        getAll: function() {
        	return $http.get('https://toastai-1950f.firebaseio.com/toasts.json')
        },
        get: function(key) {
        	return $http.get('https://toastai-1950f.firebaseio.com/toasts/' + key + ".json") 
        },
        delete: function(key) {
        	return $http.delete('https://toastai-1950f.firebaseio.com/toasts/' + key + ".json") 
        }
     };
 }])
.factory('User', ['$http', function($http) {
	return {
		create: function(user) {
			return $http.post('https://toastai-1950f.firebaseio.com/users.json', 
			{
				"name": user.name,
				"password": user.password
			})
		},
		getAll: function() {
			return $http.get('https://toastai-1950f.firebaseio.com/users.json')
		},
		get: function(key) {
			return $http.get('https://toastai-1950f.firebaseio.com/users/' + key + ".json")
		}
	}
}])
.factory('Rating', ['$http', function($http) {
	return {
		create: function(toast) {

		}
	}
}]);

// user: {name:string, password:string}
// toast: {toastiness: , user_name:,}
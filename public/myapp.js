var myApp = angular.module('myApp', ['ui.router','ui.router.state.events']);

myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('main',{
			url:'/',
			templateUrl:'list.html',
			controller:'listCtrl'
		})	
		.state('list',{
			url:'/list',
			views:{
					'': {
					templateUrl:'list.html',
					controller:'listCtrl'
					}
			}

		})
		.state('read',{
			url:'/read/{id}',
			templateUrl:'read.html',
			controller:'readCtrl'
		})
		.state('readwrong',{
			url:'/read',
			abstract: true
		})		
		.state('create',{
			url:'/create',
			templateUrl:'create.html',
			controller:'createCtrl'
		})		
		.state('delete',{
			url:'/delete/{id}',
			templateUrl:'delete.html',
			controller:'deleteCtrl'
		})
		.state('deleted',{
			url:'/delete',
			abstract: true
		})
		.state('update',{
			url:'/update/{id}',
			templateUrl:'update.html',
			controller:'updateCtrl'
		})				
		.state('search',{
			url:'/search/{keyword}',
			templateUrl:'search.html',//we mihgt just need list.html for this.
			controller:'searchCtrl'
		});
		$urlRouterProvider.otherwise('/');

}]);


myApp.run(function($rootScope, myStorage){
  $rootScope.$on('$stateChangeStart', function(){
  	console.log('Start Change Start');

	});
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromParams){
  	console.log('Start Change Success');
	});

  var list = myStorage.get();
  if(list.length > 0){
	  $rootScope.noData = false;  	
  }else{
	  $rootScope.noData = true;  	  	
  }

});


myApp.controller('appCtrl', ['$scope', '$state', 'myStorage', '$rootScope', function($scope, $state, myStorage, $rootScope){
	$scope.hello = "YOHANISON BOARD";

	$scope.boards = myStorage.get(); // GET DATA FROM FACTORY
		
	$scope.search = function(){ // SEARCH BUTTON
		console.log("Search STart: " + $scope.keyword);
    $state.go('search', {
	    keyword: $scope.keyword,
		});
	};
}]);


myApp.controller('listCtrl', ['$scope','$rootScope','myStorage', function($scope, $rootScope,myStorage){
	$scope.boards = myStorage.get();
}]);


myApp.controller('createCtrl', ['$scope','$rootScope','myStorage', function($scope, $rootScope,myStorage){
	$scope.submit = function(){
		myStorage.add($scope.title, $scope.content, $scope.author)
	};
}]);


myApp.controller('readCtrl', ['$scope', '$stateParams','myStorage', function($scope, $stateParams, myStorage){
	$scope.boards = myStorage.get();
	$scope.id = $stateParams.id;
	$scope.data = $scope.boards.find(item => item.id == $scope.id);

}]);


myApp.controller('deleteCtrl', ['$scope', '$stateParams','myStorage', function($scope, $stateParams, myStorage){
	$scope.confirm = function(id){
		myStorage.remove(id);
	}
}]);


myApp.controller('updateCtrl', ['$scope', '$stateParams','myStorage', function($scope, $stateParams, myStorage){
	var id = $stateParams.id;
	var boards = myStorage.get();	
	var data = boards.find(item => item.id == id);

	$scope.title = data.title;
	$scope.content = data.content;
	$scope.author = data.author;

	$scope.submit = function(){
		myStorage.update(id, $scope.title, $scope.content, $scope.author);
	}
}]);


myApp.controller('searchCtrl', ['$scope', '$stateParams','myStorage', function($scope, $stateParams,myStorage ){
	$scope.keyword = $stateParams.keyword;
	$scope.boards = myStorage.get();

}]);


// DB FACTORY
myApp.factory('myStorage',['$state', function($state){
	var BOARD_DATA='BOARD_DATA';

	var storage = {
		datas: [],
	  _saveToLocalStorage: function(data){
	  	localStorage.setItem(BOARD_DATA, JSON.stringify(data));
	  },

	  _getFromLocalStorage: function(){
	  	return JSON.parse(localStorage.getItem(BOARD_DATA)) || [];
	  },

		get: function(){
			angular.copy(storage._getFromLocalStorage(), storage.datas);			
			return storage.datas;
		},

		add: function(newTitle, newContent, newAuthor){
			var lastId = storage.datas.length - 1;
			console.log(lastId);
			if(lastId > -1){
				var newId = storage.datas[lastId].id + 1;				
			}else{
				var newId = 1;
			}
			console.log(newId);

	    var newTodo = {
	    		id: newId,
	        title: newTitle,
	        content: newContent,
	        author: newAuthor
	    }
	    
	    storage.datas.push(newTodo);
	    storage._saveToLocalStorage(storage.datas);
			$state.go('list');		
		},

		remove: function(id){
			var theData = storage.datas.findIndex(item => item.id == id);
			console.log(theData);
	    if(theData > -1){
	        storage.datas.splice(theData, 1)
	    }


	    console.log(storage.datas);
	    storage._saveToLocalStorage(storage.datas);
			$state.go('list');		

		},
		update: function(id, title, content, author){
			var updateData = storage.datas.find(item => item.id == id);
			updateData.title = title;
			updateData.content = content;
			updateData.author = author;
	    storage._saveToLocalStorage(storage.datas);
 			$state.go('list');		

		}


	};
	return storage;


}]);

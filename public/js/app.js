var app = angular.module('App',['ngRoute','ngResource']).run(function($rootScope,$http,$location){
    $rootScope.authenticated = false;
    $rootScope.currentUser = '';
    $rootScope.logout = function(){
        $http.get('/auth/signout').then(function(res){
            if(res.status==200){
                $rootScope.authenticated = false;
                $rootScope.currentUser = '';
                // console.log(data);
                $location.path('/login')
            }
            
        })
    }
});

//Factory for multiple use case
app.factory('postService',function($http,$resource){
    // var factory ={};
    // factory.getAll = function(){
    //     return $http.get('/api/posts');
    // }
    // return factory;
    return $resource('/api/posts/:id');
});

// Configure Routes For ng-view in index.html
app.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl:'posts.html',
        controller:'postCtrl'
    })
    .when('/login',{
        templateUrl:'login.html',
        controller:'authCtrl'
    })
    .when('/register',{
        templateUrl:'register.html',
        controller:'authCtrl'
    })
});

// Controllers
app.controller('postCtrl',function($scope,postService,$rootScope){
    $scope.posts = postService.query();
    $scope.newPost = {
        username :'',
        text : '',
        created_at : ''
    }

    // postService.getAll().then(function(res){
    //     if(res.status == 200){
    //         $scope.posts = res.data;
    //     }else{
    //         console.log(res);
    //     }
    // })

    $scope.post = function(){
        $scope.newPost.created_at = Date.now();
        $scope.newPost.created_by = $rootScope.currentUser;
        postService.save($scope.newPost,function(){
            $scope.posts = postService.query();
            $scope.newPost = {
                username :'',
                text : '',
                created_at : ''
            }
        })
        // $scope.posts.push($scope.newPost);
    }
});

app.controller('authCtrl',function($scope,$rootScope,$location,$http){
    $scope.user = {
        username : '',
        password : ''
    };

    $scope.errorMsg = '';

    $scope.register = function(){
        $http.post("/auth/signup",$scope.user).then(function(res){
           if(res.data.user){
            var data = res.data;
            $rootScope.authenticated = true;
            $rootScope.currentUser = data.user.username;
            $location.path('/');
        }else{
            console.log(res);
            $scope.errorMsg = 'Registeration failed for '+$rootScope.currentUser;
        }
        });
    }

    $scope.login = function(){
        $http.post("/auth/login",$scope.user).then(function(res){
            if(res.data.user){
                var data = res.data;
                $rootScope.authenticated = true;
                $rootScope.currentUser = data.user.username;
                $location.path('/');
            }else{
                console.log(res);
                $scope.errorMsg = 'Login failed for '+$rootScope.currentUser;
            }
        });
    }
});
angular.module('app', [])
.controller('viewHome', ['$scope','$http', ($scope, $http) => 
{
    $scope.comments = [];
    $scope.posts = [];
    $scope.comment = {content: ''};

    $scope.init = () => {
        $http.get(`/api/post/user`).then( (res) => {
             $scope.posts = res.data.slice().reverse();
             $scope.data = true;
             console.log(res.data);
        });
        /*$scope.projects.forEach(($project) => {
            $http.get(`/api/post/regex/${$project}`).then( (res) => {
                $scope.posts.splice(0, 0, res.data);
                $scope.data = true;
            });
        });*/
    };

    $scope.init();

    $scope.viewComments = ($index) => {
        //$index = $scope.posts.length - $inde - 1;
        console.log($scope.posts[$index]);
        $http.get(`/api/comment/post/${$scope.posts[$index]._id}`)
        .then((res) => { 
            $scope.comments[$index] = res.data;
            console.log($scope.comments[$index]);
        });
    };

    /*$scope.addPost = () => {
        $scope.post.project = project;
        $http.post('/api/post', $scope.post)
        .then((res) => {
            $scope.posts.splice(0, 0, res.data);
            console.log(res.data);
        })
        .catch(() => {
            console.log('No Agregado C:');
        }); 
    };*/

    $scope.addComment = ($index) => {
        $scope.comment.content = $(`#comment${$index}`).val();
        $http.post(`/api/comment/post/${$scope.posts[$index/*[$scope.posts.length - $index - 1]*/]._id}`, $scope.comment)
        .then((res) => {
            $scope.comments[$index].push(res.data);
            $scope.comment.content =  '';
        })
        .catch(() => {
            console.log('No Agregado C:');
        });
    };
}])
.controller('request', ['$scope','$http', ($scope, $http)  => {
    console.log('Request');
}]);
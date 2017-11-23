angular.module('post', [])
.controller('viewPost', ['$scope','$http', ($scope, $http) => 
{
  $scope.comments = [];
  $scope.posts = [];
  $scope.comment = {content: ''};

  const project = window.location.pathname.split('/')[2];

  $http.get(`/api/member/project/${project}`).then((res) => {
    $scope.members = res.data;
    console.log(res.data);
  });

  $scope.init = () => {
    $http.get(`/api/post/project/${project}`).then( (res) => {
        $scope.posts = res.data.slice().reverse();
        $scope.data = true;
    });
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

  $scope.addPost = () => {
    $scope.post.project = project;
    $http.post('/api/post', $scope.post)
    .then((res) => {
        $scope.posts.splice(0, 0, res.data);
        $scope.comments[$scope.comments.length + 1].splice(0, 0, null);
        $scope.post = [];
        $scope.data = true;
        console.log(res.data);
    })
    .catch(() => {
        console.log('No Agregado C:');
    }); 
  };

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
}]);
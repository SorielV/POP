angular.module('app', [])
.controller('viewPost', ['$scope','$http', ($scope, $http) => {
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
        $scope.posts = res.data
        $scope.data = true;
    });
  };

  $scope.init();

  $scope.viewComments = ($index) => {
    $http.get(`/api/comment/post/${$scope.posts[$index]._id}`)
    .then((res) => { 
        $scope.comments[$index] = res.data;
        console.log($scope.comments[$index]);
    })
    .catch((err) => {

    });
  };

  $scope.addMember = () => {
    console.log($scope.member);
    $http.post(`/api/request/project/${project}/${$scope.member}`)
    .then((res) => { 
        console.log('Solicitud Enviada C:');
        /*$scope.comments[$index] = res.data;
        console.log($scope.comments[$index]);*/
    })
    .catch((err) => {

    });
  };

  $scope.addPost = () => {
    $scope.post.project = project;
    $http.post('/api/post', $scope.post)
    .then((res) => {
        $scope.posts.push(res.data);
        $scope.comments.push([]);
        $scope.post = [];
        $scope.data = true;
        console.log(res.data);
    })
    .catch((err) => {
      
    });
  };

  $scope.addComment = ($index) => {
    $scope.comment.content = $(`#comment${$index}`).val();
    $(`#comment${$index}`).val('');
    $http.post(`/api/comment/post/${$scope.posts[$index]._id}`, $scope.comment)
    .then((res) => {
        $scope.comments[$index].push(res.data);
        $scope.comment.content =  '';
    })
    .catch((err) => {
        console.log('No Agregado C:');
    });
  };
}])
.controller('request', ['$scope','$http', ($scope, $http)  => {
  $http.get('/api/request/user')
  .then((res) => {
    console.log(res.data);
    $scope.requests = res.data;
  });

  $scope.acceptRequest = ($index) => {
    $http.put(`/api/request/${$scope.requests[$index]._id}`)
    .then((res) => {
      console.log('Solicitud Aceptada C:');
    })
    .catch((err) => {
     console.log('Solicitud No Aceptada C:');
    });
  };

  $scope.rejectRequest = ($index) => {
    $http.delete(`/api/request/${$scope.requests[$index]._id}`)
    .then(res => {
      console.log('Solicitud Rechazada C:');
    })
    .catch(err => {
     console.log('Solicitud No Rechazada C:'); 
    });
  };
}]);
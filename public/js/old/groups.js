angular.module('app', [])
.controller('viewGroup', ['$scope','$http', ($scope, $http)  => 
{
    $http.get('/api/project/')
    .then((res) => {	
        $scope.groups = res.data;		
    });
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

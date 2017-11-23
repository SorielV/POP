new Vue({
	el: "#app",
	componets: {
		/*'post' : { post },
		'comment': { comment }*/
	},
	data: {
		project: String,
		username: String,
	},
	created: function() {
		this.project = window.location.pathname.split('/')[2] || ''
		this.username = username || ''
		console.log(this.username)
	}
	/*created: function() {
		this.project = window.location.pathname.split('/')[2] 

		this.$http.get(`/api/post/project/${this.project}`)
		.then(response => {
			//Paginacion futur response.data.data
			this.posts = response.data
		})
		.catch((err) => {
			console.log(err)
			this.posts = ''
		})

	},*/
	
})

/*
  $scope.addMember = () => {
    console.log($scope.member);
    $http.post(`/api/request/project/${project}/${$scope.member}`)
    .then((res) => { 
        console.log('Solicitud Enviada C:');
        //$scope.comments[$index] = res.data;
        //console.log($scope.comments[$index]);
    })
    .catch((err) => {

    });
  };
*/
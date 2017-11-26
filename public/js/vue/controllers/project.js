new Vue({
	el: "#app",
	componets: {},
	data: {
		project: String,
		username: String,
		options: ['-'],
		multiple: false,
		selected: [],
		value: '',
		search: ''
	},
	methods: {
		addTag: function(_tag) {
    	this.options.push(_tag)
    	this.selected.push(_tag)
    },
    updateSelected: function(selected) {
    	this.selected = selected
    },
    change: function($event) {
    	if($event.target.value === 'tag') {
    		this.multiple = true
    	} else {
    		this.multiple = false
    	}
    }
	},
	created: function() {
		this.project = window.location.pathname.split('/')[2] || ''
		this.username = username || ''
	}

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
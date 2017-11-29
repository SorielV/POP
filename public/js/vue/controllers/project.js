new Vue({
	el: "#app",
	componets: {},
	data: {
		project: String,
		username: String,
    /*  */
    field: 'title',
    fields: [
      { text: 'Projecto', value: 'project' },
      { text: 'Titulo', value: 'title' },
      { text: 'Etiquetas', value: 'tag' }
    ],
		options: ['-'],
		multiple: false,
		selected: [],
    filter: '',
		value: '',
		search: '',
    error: false
    /*  */
	},
	methods: {
		addTag: function(_tag) {
      if(this.multiple) {
        if(!Array.isArray(this.selected)) {
          this.selected = []
        }
        this.options.push(_tag)
        this.selected.push(_tag)
      } else {
        this.selected = _tag  
      } 
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
  watch: {
    selected: function() {
      this.filter = this.selected
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
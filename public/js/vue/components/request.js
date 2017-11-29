Vue.component('request', {		
	template: 
		`<li class="list-group-item justify-content-between">
			<span v-text="request.from"></span>
      <i @click="acceptRequest" class="animated rotateIn fa fa-check" aria-hidden="true" style="color: green;"></i>
     	<i @click="rejectRequest" class="animated red-text rotateIn fa fa-times" aria-hidden="true"></i>
    </li>`,
  props: {
  	request: {},
  	index: Number
  },
  methods: {
  	acceptRequest: function() {
  		this.$emit('accept', this.index)
  	},
  	rejectRequest: function() {
  		this.$emit('reject', this.index)
  	}
  }
});

Vue.component('requests', {
	template: 
		`<div>
			<ul class="list-group z-depth-0" >
				<template v-if="requests.length !== 0">
					<template v-for="(request, $index) in requests">
						<request @accept="accept" @reject="reject" 
							:index="$index" :request="request">
						</request>
					</template>
				</template>
				<template v-else>
					<li class="list-group-item justify-content-between">
						<span>Sin solicitudes</span>
					</li>
				</template>
			</ul>
		</div>`,
	props: {
		api : {
			default: '/api/request/user',
			type: String
		}
	},
	data: function() {
		return {
			requests : Array
		}
	},
	created: function() {
		this.$http.get(this.api)
		.then(response => {
			this.requests = response.data
		})
		.catch(err => {
			console.log(err)
			this.requests = []
		})
	},
	methods: {
		accept: function($index) {
			this.$http.put(`/api/request/${this.requests[$index]._id}`)
	    .then(response => {
	      this.requests.splice($index, 1)
	    })
	    .catch(err => {
	     console.log('Solicitud No Aceptada C:');
	    });
		},
		reject: function($index) {
			this.$http.delete(`/api/request/${this.requests[$index]._id}`)
    	.then(response => {
    		this.requests.splice($index, 1)
    	})
    	.catch(err => {
     		console.log('Solicitud No Rechazada C:'); 
    	});
		}
	}
});
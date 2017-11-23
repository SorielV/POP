Vue.component('profile', {
	template: 
		`<form class="col-12" v-on:submit.prevent="updateProfile">
		 	<div class="md-form">
		    <i class="fa fa-lock prefix grey-text"></i>
				<input type="text" v-model="profile.name" class="form-control" required>
				<label>Name</label>
		  </div>

		  <div class="md-form">
		    <i class="fa fa-lock prefix grey-text"></i>
				<input type="text" v-model="profile.description" class="form-control" required>
				<label>Description</label>
		  </div>

		  <div class="md-form">
		    <i class="fa fa-lock prefix grey-text"></i>
				<input type="number" v-model="profile.age" class="form-control" required>
				<label>Age</label>
		  </div>

		  <div class="md-form">
		    <i class="fa fa-lock prefix grey-text"></i>
				<input type="text" v-model="profile.rol" class="form-control" required>
				<label>Rol</label>
		  </div>

		  <div class="md-form">
		    <i class="fa fa-lock prefix grey-text"></i>
				<input type="text" v-model="profile.tag" class="form-control" required>
				<label>Tags</label>
		  </div>

		  <div class="text-center">
				<button class="btn btn-default">Update Profile</button>
		  </div>
		</form>`,
	data: function(){
		return {
			user: Object,
			profile: Object
		}
	},
	methods: {
		updateProfile: function() {
			this.$http.put('/api/profile', this.profile)
			.then(response => {
				console.log('Update C:')
				this.profile = response.data
				$('#success').modal('show')
			})
			.catch(err => {
				console.log(err)
				this.profile = []
				$('#error').modal('show')
			})
		}
	},
	created: function() {
		this.$http.get('/api/profile')
		.then(response => {
			this.profile = response.data
		})
		.catch(err => {
			console.log(err)
			this.profile = []
		})
	}
})
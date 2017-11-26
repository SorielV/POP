new Vue({
	el: "#app",
	data: {
		api: '/api/request/project/',
		project: String,
		username: String,
	},
	created: function() {
		this.project = window.location.pathname.split('/')[2] || ''
		this.username = username || ''
		console.log(this.username)
	},
	methods: {
		sendJoinRequest: function() {
			this.$http.post(`${this.api}${this.project}`)
			.then(request => {
				$('#success').modal('show')
			})
			.catch(err => {
				console.log(err)
				$('#error').modal('show')
			})
		}
	}
})
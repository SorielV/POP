Vue.component('members', {
	template: 
		`<div>
			<ul class="tags" v-for="member in members">
        <li><a class="trigger" :href="'/profile/' + member.username" v-text="member.username"></a></li>
			</ul>
			<input type="text" @keyup.enter="addMember" v-model="member" class="form-control" placeholder="Add Member">
		</div>`,
	props: ['project'],
	data: function() {
		return {
			members: [],
			member: ''
		}
	},
	methods: {
		addMember: function() {
			this.$http.post(`/api/request/project/${this.project}/${this.member}`)
			.then(request => {
				$('#success').modal('show')
				this.member = ''
			})
			.catch(err => {
				console.log(err)
				$('#error').modal('show')
			})
		}
	},
	created: function() {
		this.$http.get(`/api/member/project/${this.project}`)
		.then(response => {
			this.members = response.data
		})
		.catch(err => {
			console.log(err)
			this.members = []
		})
	}	
})
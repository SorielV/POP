Vue.component('list-project', {
	template: 
		`<div>	
			<ul class="list-group list-project">
				<template v-for="project in projects">	
					<li class="list-group-item d-flex justify-content-between align-items-center" >
		        <span v-text="project.project"></span>
		       	<span class="badge badge-primary badge-pill">1</span>
		    	</li>
				</template>
			</ul>
		</div>`,
	data: function() { 
		return {
				projects: []
		}
	},
	created: function() {
		this.$http.get('/project/user/list')
		.then(response => {
			this.projects = response.data
		})
		.catch((err) => {
			console.log(err)
		})
	}
})
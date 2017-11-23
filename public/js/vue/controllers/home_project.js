new Vue({
	el: "#app"/*,
	data: {
		projects: Array,
		next_page: String
	},
	methods: {
		loadMore: function() {
			if(this.next_page != '') {
				this.$http.get(this.next_page)
				.then(response => {
					this.projects.push(response.data.data);
					this.next_page = response.data.next_page;
				}) 
				.catch(err => {
				this.projects = [];
				})
			} 
		}
	}*/
})
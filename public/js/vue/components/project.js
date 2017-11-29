Vue.component('projects' ,{
	template: 
		`<div class="row col-12">
		 	<div class="col-md-6" v-for="(project, $index) in filtered">
				<div class="text-white text-center card card-image mb-3" :style="'background-image: url(' + project.img + ') !important'">
					<div class="rgba-stylish-strong flex-center text-white text-center d-flex align-items-center py-5 px-4">
						<div class="justify-content-center">
							<h5 class="white-text">
								<i class="fa fa-line-chart"></i>
								<span v-text="project.project"></span>
							</h5>
							<h3 class="red-text card-title pt-2">
								<strong v-text="project.title"></strong>
							</h3>
							<p v-text="project.description"></p>
		          <a class="btn btn-blue-grey bg-danger waves-effect waves-light" :href="'/project/' + project.project">
		          	<i class="fa fa-clone left"></i> Ver Proyecto	
		          </a>
						</div>
		      </div>
					<div class="card-data bg-dark">
		        <ul class="tags">
							<li v-for="tag in tags($index)">
								<a class="trigger" :href="'/' + tag" v-text="tag"></a>
							</li>
						</ul>
					</div>
    		</div>
    	</div>
    </div>`,
	props: {
		api: String,
		field: {
			default: 'project'
		},
		filter: {
			default: ''
		}
	},
	data: function() {
		return {
			filtered: [],
			projects: Array,
			search: false
		}
	},
	methods: {
		tags: function($index) {
			return this.projects[$index].tag.split(',')
		}
	},
	watch: {
		filter: function() {
			let _filter = Array.isArray(this.filter) 
				? `(${this.filter.join('|')})` //No Estricto
				: this.filter.trim();

			this.filtered = this.projects.filter((item) => {
				return RegExp(_filter).test(item[this.field]) 	
			})

			if(this.filtered.length === 0) {
				this.filtered = this.projects
			}
		},
		field : function() {
			this.filtered = this.projects
		}
	},
	created: function() {
		this.$http.get(this.api)
		.then(response => {
			this.projects = response.data
			this.filtered = response.data 
		}) 
		.catch(err => {
			this.projects = []
		})
	},
})
/*
			/*function regex(item) {
				return new Promise((resolve, reject) => {
					console.log(_filter[0].test(item) ? 'true' : 'false')
					for(i = 0; i < _filter.length; i++) {
						console.log(_filter[i].test(item) ? 'true' : 'false')
						if(!_filter[i].test(item)) {
							return reject()
						}
						else if(i === _filter.length -1) {
							resolve()
						} 
					}
				})
			}	*/

			/*if(Array.isArray(_filter)) { 
				this.filtered = this.projects.filter((item) => {					
					regex(item[this.field])
					.then(() => {
						console.log(`${item[this.field]} true`)
						return true
					})
					.catch(() => {
						console.log(`${item[this.field]} false`)
					 return false;
					})
					 return RegExp(regex).test(item[this.field]) 		
				})
				console.log(_filter)
			} else {*/	
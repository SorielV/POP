Vue.component('projects' ,{
	template: 
		`<div class="row col-12">
		 	<div class="col-md-6" v-for="(project, $index) in projects">
				<div class="text-white text-center card card-image mb-3" :style="'background-image: url(' + project.img + ') !important'">

			<div class="mask pattern-8 flex-center  text-white text-center d-flex align-items-center py-4 px-4">
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
          	<i class="fa fa-clone left"></i> Ver projecto	
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
	props: ['api'],
	data: function() {
		return {
			projects: Array
		}
	},
	methods: {
		tags: function($index) {
			return this.projects[$index].tag.split(',')
		}
	},
	created: function() {
		this.$http.get(this.api)
		.then(response => {
			this.projects = response.data
		}) 
		.catch(err => {
			this.projects = []
		})
	},
})